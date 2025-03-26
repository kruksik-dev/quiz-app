import csv
import io
import random
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import Cookie, Depends, FastAPI, File, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from backend.database.database import get_db, init_db
from backend.database.model import Question


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Lifespan context manager for application startup and shutdown."""
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

request_origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3050",
    "http://127.0.0.1:3050",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=request_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/question/", response_model=Question)
async def add_question(
    question: Question, db: AsyncSession = Depends(get_db)
) -> Question:
    if question.correct_option not in [1, 2, 3, 4]:
        raise HTTPException(
            status_code=400, detail="Correct option must be between 1 and 4"
        )
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question


@app.get("/question/{id}", response_model=Question)
async def get_question(id: int, db: AsyncSession = Depends(get_db)) -> Question:
    question = await db.get(Question, id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@app.patch("/question/{id}", response_model=Question)
async def patch_question(
    id: int, question: Question, db: AsyncSession = Depends(get_db)
) -> Question:
    existing_question = await db.get(Question, id)
    if not existing_question:
        raise HTTPException(status_code=404, detail="Question not found")

    for key, value in question.dict().items():
        if key == "correct_option" and value not in [1, 2, 3, 4]:
            raise HTTPException(
                status_code=400, detail="Correct option must be between 1 and 4"
            )
        setattr(existing_question, key, value)

    await db.commit()
    await db.refresh(existing_question)
    return existing_question


@app.delete("/question/{id}", response_model=Question)
async def delete_question(id: int, db: AsyncSession = Depends(get_db)) -> Question:
    question = await db.get(Question, id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    await db.delete(question)
    await db.commit()
    return question


@app.get("/question/", response_model=list[Question])
async def get_all_questions(
    skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)
) -> list[Question]:
    result = await db.execute(select(Question).offset(skip).limit(limit))
    questions: list[Question] = list(result.scalars().all())
    return questions


@app.post("/add_bulk_questions/", response_model=list[Question])
async def add_questions_from_csv(
    csv_file: UploadFile = File(...), db: AsyncSession = Depends(get_db)
):
    if csv_file.content_type != "text/csv":
        raise HTTPException(
            status_code=400, detail="Invalid file type. Please upload a CSV file."
        )

    content = await csv_file.read()
    content = content.decode("utf-8-sig", errors="ignore")
    reader = csv.DictReader(io.StringIO(content))

    questions = []

    for row in reader:
        if (
            "question" not in row
            or "option_1" not in row
            or "option_2" not in row
            or "option_3" not in row
            or "option_4" not in row
            or "correct_option" not in row
        ):
            raise HTTPException(
                status_code=400, detail="CSV file is missing required columns."
            )

        correct_option = int(row["correct_option"])
        if correct_option not in [1, 2, 3, 4]:
            raise HTTPException(
                status_code=400, detail="Correct option must be between 1 and 4"
            )

        new_question = Question(
            question=row["question"],
            option_1=row["option_1"],
            option_2=row["option_2"],
            option_3=row["option_3"],
            option_4=row["option_4"],
            correct_option=correct_option,
        )
        db.add(new_question)
        questions.append(new_question)

    await db.commit()
    return questions


@app.get("/random_question/", response_model=Question)
async def get_random_question(
    response: Response,
    last_question_id: int = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> Question:
    result = await db.execute(select(Question))
    questions: list[Question] = list(result.scalars().all())

    if not questions:
        raise HTTPException(status_code=404, detail="No questions available")

    if last_question_id is not None:
        result = await db.execute(
            select(Question).where(Question.id != last_question_id)
        )
        available_questions = result.scalars().all()
    else:
        available_questions = questions

    question = random.choice(available_questions)
    response.set_cookie(key="last_question_id", value=str(question.id))

    return question


@app.post("/check_answer/")
async def check_answer(
    question_id: int, selected_option: int, db: AsyncSession = Depends(get_db)
) -> dict[str, str | bool]:
    question = await db.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    if selected_option == question.correct_option:
        return {"correct": True, "message": "Poprawna odpowiedź !"}
    else:
        return {
            "correct": False,
            "message": "Zła odpowiedź :( ",
        }

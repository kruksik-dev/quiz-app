from sqlmodel import Field, SQLModel


class Question(SQLModel, table=True):
    """Model pytania."""

    id: int | None = Field(default=None, primary_key=True)
    question: str
    option_1: str
    option_2: str
    option_3: str
    option_4: str
    correct_option: int

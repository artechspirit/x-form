type RawAnswers = Record<string, string | string[]>;

interface TransformedAnswer {
  question_id: number;
  value: string;
}

interface TransformedPayload {
  answers: TransformedAnswer[];
}

export function transformAnswers(raw: RawAnswers): TransformedPayload {
  const answers = Object.entries(raw).map(([questionId, value]) => ({
    question_id: Number(questionId),
    value: Array.isArray(value) ? value.join(", ") : value,
  }));

  return { answers };
}

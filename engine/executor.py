from openai import OpenAI

client = OpenAI()

class Executor:
    def run(self, prompt: str) -> str:
        response = client.chat.completions.create(
            model="gpt-5.3",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        return response.choices[0].message.content
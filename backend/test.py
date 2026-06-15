from openai import OpenAI

client = OpenAI(
    api_key="YOUR_ECOMAGENT_KEY",
    base_url="https://api.ecomagent.in/v1",
    timeout=120
)

print("Sending...")

response = client.chat.completions.create(
    model="claude-opus-4.6",
    messages=[
        {
            "role": "user",
            "content": "Say hello"
        }
    ]
)

print(response)
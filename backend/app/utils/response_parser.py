def extract_ai_text(response):

    if isinstance(response, str):
        return response

    if "choices" in response:
        return response["choices"][0]["text"]

    if "results" in response:
        return response["results"][0]["generated_text"]

    return str(response)
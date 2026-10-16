import os
import sys
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"==================================================")
    print(f"🚦 Traffic Safety AI Backend Starting on http://{host}:{port}")
    print(f"📌 Swagger UI Documentation: http://localhost:{port}/docs")
    print(f"📌 Health Check: http://localhost:{port}/health")
    print(f"==================================================")
    uvicorn.run("main:app", host=host, port=port, reload=True)

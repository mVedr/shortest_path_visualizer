import redis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
r = redis.Redis(host='localhost',port=6379,)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    #r.set("currForward",random.randint(0,3))
    return {"message": "Hello Redis"}

@app.get("/currentForward")
async def getForward():
    return {"data":int(r.get("currForward"))}

@app.get("/setForward")
async def setForward(fwd: int = 0):
    r.set("currForward",fwd)
    return {"data":int(r.get("currForward"))}
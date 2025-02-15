'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-15 14:13:07
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-15 17:27:41
FilePath: \MVP\backend\api.py
Description: 
'''
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from optimizer import init_langchain, optimize_prompt
from data_manager import DataManager, MetadataGenerator

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 默认端口
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    optimizedPrompt: str
    metadata: dict

class SaveResultRequest(BaseModel):
    metadata: dict
    result: str

class FeedbackRequest(BaseModel):
    metadata: dict
    feedbackType: str
    feedbackData: dict

@app.post("/api/optimize")
async def optimize(request: PromptRequest):
    try:
        # 初始化必要组件
        chain = init_langchain()
        data_mgr = DataManager()
        meta_gen = MetadataGenerator()
        
        # 生成元数据
        metadata = meta_gen.generate("user_prompt")
        
        # 保存原始 prompt
        data_mgr.save_record({
            **metadata,
            "content": request.prompt
        }, "raw_prompt")
        
        # 优化 prompt
        optimized = optimize_prompt(chain, request.prompt)
        
        # 保存优化结果
        data_mgr.save_record({
            **metadata,
            "content": optimized
        }, "optimized_prompt")
        
        return PromptResponse(
            optimizedPrompt=optimized,
            metadata=metadata
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save-result")
async def save_result(request: SaveResultRequest):
    try:
        data_mgr = DataManager()
        data_mgr.save_record({
            **request.metadata,
            "content": request.result
        }, "result")
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        data_mgr = DataManager()
        data_mgr.save_record({
            **request.metadata,
            "content": str(request.feedbackData)
        }, "feedback")
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True) 
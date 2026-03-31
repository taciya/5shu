import requests
import json
from typing import Dict, List, Optional

class AnythingLLMClient:
    def __init__(self, base_url: str = "http://localhost:3001", api_key: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
        }
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"
    
    def send_message(self, workspace_id: str, message: str, mode: str = "query") -> Dict:
        """向指定工作区发送消息"""
        url = f"{self.base_url}/api/v1/workspace/{workspace_id}/chat"
        
        payload = {
            "message": message,
            "mode": mode  # "query" 或 "conversation"
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_workspaces(self) -> List[Dict]:
        """获取所有工作区"""
        url = f"{self.base_url}/api/v1/workspaces"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_workspace(self, workspace_id: str) -> Dict:
        """获取特定工作区信息"""
        url = f"{self.base_url}/api/v1/workspace/{workspace_id}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

# 使用示例
def main():
    # 初始化客户端
    client = AnythingLLMClient(
        base_url="https://anythingllm-5shu.fly.dev",
        api_key="YASVJDV-DP9MNDM-QX28175-5XT5JB0"  # 替换为您的 ADMIN_API_KEY
    )
    
    # 获取所有工作区
    workspaces = client.get_workspaces()
    print("可用工作区:", workspaces)
    
    if workspaces:
        # 使用第一个工作区
        workspace_id = workspaces['workspaces'][0]['slug']
        
        # 发送消息
        response = client.send_message(
            workspace_id=workspace_id,
            message="什么是机器学习？",
            mode="query"
        )
        
        print("AI 回复:", response.get('textResponse', '无回复'))
        print("参考文档:", response.get('sources', []))

if __name__ == "__main__":
    main()
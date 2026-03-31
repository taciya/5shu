import requests
import json
from typing import Dict, List, Optional

class AnythingLLMClient:
    def __init__(self, base_url: str = "https://anythingllm-5shu.fly.dev", api_key: Optional[str] = None):
        # 确保URL以https开头且没有尾随斜杠
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
        }
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"
    
    def send_message(self, workspace_id: str, message: str, mode: str = "query") -> Dict:
        """向指定工作区发送消息"""
        # 使用新的API端点格式
        url = f"{self.base_url}/api/v1/workspace/{workspace_id}/chat"
        
        payload = {
            "message": message,
            "mode": mode  # "query" 或 "conversation"
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.headers, timeout=30)
            response.raise_for_status()  # 检查HTTP错误状态码
            return response.json()
        except requests.exceptions.RequestException as e:
            # 添加详细的错误处理
            print(f"API请求失败: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"响应状态码: {e.response.status_code}")
                print(f"响应内容: {e.response.text}")
            return {"error": str(e)}
        except json.JSONDecodeError:
            print(f"JSON解析失败，原始响应: {response.text}")
            return {"error": "JSON解析失败"}
    
    def get_workspaces(self) -> List[Dict]:
        """获取所有工作区"""
        url = f"{self.base_url}/api/v1/workspaces"
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            # 检查响应结构 - 可能是列表或字典
            data = response.json()
            
            # 如果响应是字典且包含'workspaces'键
            if isinstance(data, dict) and 'workspaces' in data:
                return data['workspaces']
            # 如果响应直接是工作区列表
            elif isinstance(data, list):
                return data
            else:
                print(f"意外的工作区响应格式: {type(data)}")
                return []
        except requests.exceptions.RequestException as e:
            print(f"获取工作区失败: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"响应状态码: {e.response.status_code}")
                print(f"响应内容: {e.response.text}")
            return []
    
    def get_workspace(self, workspace_id: str) -> Dict:
        """获取特定工作区信息"""
        url = f"{self.base_url}/api/v1/workspace/{workspace_id}"
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"获取工作区信息失败: {e}")
            return {}

# 使用示例
def main():
    # 初始化客户端 - 使用fly.io的URL
    client = AnythingLLMClient(
        base_url="https://anythingllm-5shu.fly.dev",
        # 
        # api_key="YASVJDV-DP9MNDM-QX28175-5XT5JB0"  # 替换为您的 ADMIN_API_KEY
        api_key="YHM3RSD-888MCB3-J6241GH-F6QMNN3"  # fly.io
    )
    
    # 1. 获取所有工作区
    workspaces = client.get_workspaces()
    
    # 处理工作区列表
    if workspaces:
        print("可用工作区:")
        for workspace in workspaces:
            # 检查工作区对象的结构
            if isinstance(workspace, dict):
                name = workspace.get('name', '未知名称')
                slug = workspace.get('slug', '未知ID')
                print(f"- {name} (ID: {slug})")
            else:
                print(f"- 意外的工作区格式: {type(workspace)}")
    else:
        print("未找到工作区")
    
    # 2. 直接使用已知的工作区ID "doushu"
    workspace_id = "doushu"
    
    # 3. 验证工作区存在
    workspace_info = client.get_workspace(workspace_id)
    if workspace_info.get('workspace'):
        print(f"\n使用工作区: {workspace_info['workspace'][0]}")
    else:
        print(f"错误: 工作区 '{workspace_id}' 不存在")
        return
    
    # 4. 发送消息到工作区
    response = client.send_message(
        workspace_id=workspace_id,
        message="什么是机器学习？",
        mode="query"
    )
    
    # 5. 处理响应
    if 'textResponse' in response:
        print("\nAI 回复:", response['textResponse'])
        if 'sources' in response and response['sources']:
            print("\n参考文档:")
            for source in response['sources']:
                print(f"- {source.get('title', '无标题')} (相关性: {source.get('score', 0):.2f})")
    else:
        print("错误: 未收到有效回复")
        print("完整响应:", json.dumps(response, indent=2))

if __name__ == "__main__":
    main()
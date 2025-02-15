import json
import os
def load_config(config_path):
    with open(config_path, 'r') as file:
        config = json.load(file)
    return config
def get_model_config(config_path="config.json", 
                     api_key_name="DMXAPI_API_KEY_1", 
                     base_url_name="DMXAPI_REST_URL_1", 
                     model_name="DMXAPI_MODEL"):
    """
    获取模型配置

    参数:
    config_path (str): 配置文件的路径。
    api_key_name (str): API密钥的名称。
    base_url_name (str): 基础URL的名称。
    model_name (str): 模型名称。

    返回:
    API密钥、基础URL和模型名称

    异常:
    ValueError: 如果API密钥或基础URL未找到。
    """
    config = load_config(config_path)
    
    api_key = config['api_keys'].get(api_key_name)
    base_url = config['base_urls'].get(base_url_name)
    model_name = config['model_names'].get(model_name)
    
    if not api_key or not base_url or not model_name:
        raise ValueError(f"API key 或 URL 或 model_name 未找到: {api_key_name}, {base_url_name},{model_name}")
    
    print(f"正在使用{base_url_name} 服务商提供的{model_name} 模型")
    
    return api_key,base_url,model_name

if __name__ == "__main__":
    get_model_config()
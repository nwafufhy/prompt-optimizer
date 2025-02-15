import sqlite3

def query_database(db_name="prompts.db"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    # 查询所有记录
    cursor.execute("SELECT * FROM prompts")
    rows = cursor.fetchall()
    
    # 打印表头
    headers = [description[0] for description in cursor.description]
    print("\t".join(headers))
    
    # 打印每一行记录
    for row in rows:
        print("\t".join(str(item) for item in row))
    
    conn.close()

if __name__ == "__main__":
    query_database()
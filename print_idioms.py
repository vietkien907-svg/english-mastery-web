import sqlite3

conn = sqlite3.connect(r'C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db')
c = conn.cursor()
c.execute("SELECT word, pos, pron, meaning_vi, example, unit FROM knowledge_items WHERE item_type = 'idiom'")
for r in c.fetchall():
    print(r)
conn.close()

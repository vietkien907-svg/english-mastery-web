import sqlite3

conn = sqlite3.connect(r'C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db')
c = conn.cursor()

c.execute("SELECT unit, item_type, count(id) FROM knowledge_items GROUP BY unit, item_type ORDER BY unit")
rows = c.fetchall()
unit_stats = {}
for u, t, cnt in rows:
    unit_stats.setdefault(u, {})[t] = cnt

print(f"{'Unit':<65} | {'Words':<6} | {'Collocations':<12} | {'Idioms':<6} | {'Total':<6}")
print("-" * 105)
for u, stats in unit_stats.items():
    words = stats.get('word', 0)
    colls = stats.get('collocation', 0)
    idioms = stats.get('idiom', 0)
    total = words + colls + idioms
    print(f"{u:<65} | {words:<6} | {colls:<12} | {idioms:<6} | {total:<6}")

conn.close()

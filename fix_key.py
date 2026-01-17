
import json

with open('/media/horizon/HDD1_Fix/Antigravity/TNDNB/ontap-web/server/serviceAccountKey.json', 'r') as f:
    data = json.load(f)

key = data['private_key']
# Ensure actual newlines
print(key) 

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.MONGO_INITDB_DATABASE;

print(`Creando usuario: ${username} en db: ${dbName}`);

db = db.getSiblingDB(dbName);

db.createUser({
  user: username,
  pwd: password,
  roles: [{ role: "readWrite", db: dbName }],
});

print("Usuario creado exitosamente");

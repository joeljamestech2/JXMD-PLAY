// MEGA storage helper. Credentials are configured through Vercel Environment Variables.
// Required: MEGA_EMAIL and MEGA_PASSWORD.
const { Storage } = require('megajs');

let storagePromise;
async function getStorage() {
  if (!process.env.MEGA_EMAIL || !process.env.MEGA_PASSWORD) {
    throw new Error('MEGA credentials are not configured (MEGA_EMAIL / MEGA_PASSWORD).');
  }
  if (!storagePromise) {
    storagePromise = new Storage({ email: process.env.MEGA_EMAIL, password: process.env.MEGA_PASSWORD }).ready;
  }
  return storagePromise;
}
async function getFolder(storage, name, create = true) {
  const root = storage.root;
  let folder = root.children.find(x => x.name === name && x.directory);
  if (!folder && create) folder = await root.mkdir(name);
  if (!folder) throw new Error(`MEGA folder not found: ${name}`);
  return folder;
}
async function readJSON(folderName, fileName, fallback) {
  const storage = await getStorage();
  const folder = await getFolder(storage, folderName);
  const file = folder.children.find(x => x.name === fileName && !x.directory);
  if (!file) return fallback;
  const buffer = await file.downloadBuffer();
  return JSON.parse(buffer.toString('utf8'));
}
async function writeJSON(folderName, fileName, data) {
  const storage = await getStorage();
  const folder = await getFolder(storage, folderName);
  const old = folder.children.find(x => x.name === fileName && !x.directory);
  if (old) await old.delete();
  await folder.upload({ name: fileName, size: Buffer.byteLength(JSON.stringify(data, null, 2)) }, Buffer.from(JSON.stringify(data, null, 2))).complete;
  return true;
}
module.exports = { getStorage, getFolder, readJSON, writeJSON };

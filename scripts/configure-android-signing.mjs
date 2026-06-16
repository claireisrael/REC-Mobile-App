import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const androidDir = path.resolve(__dirname, '../android');
const appBuildGradle = path.join(androidDir, 'app/build.gradle');
const keystorePath = path.join(androidDir, 'app/release.keystore');

const keystoreBase64 = process.env.ANDROID_KEYSTORE_BASE64;
const storePassword = process.env.ANDROID_KEYSTORE_PASSWORD;
const keyAlias = process.env.ANDROID_KEY_ALIAS;
const keyPassword = process.env.ANDROID_KEY_PASSWORD ?? storePassword;

if (!keystoreBase64 || !storePassword || !keyAlias) {
  console.log('No release keystore secrets found — using Expo default debug signing for release APK.');
  process.exit(0);
}

await fs.mkdir(path.dirname(keystorePath), { recursive: true });
await fs.writeFile(keystorePath, Buffer.from(keystoreBase64, 'base64'));

const keystoreProperties = [
  'REC_RELEASE_STORE_FILE=release.keystore',
  `REC_RELEASE_KEY_ALIAS=${keyAlias}`,
  `REC_RELEASE_STORE_PASSWORD=${storePassword}`,
  `REC_RELEASE_KEY_PASSWORD=${keyPassword}`,
  '',
].join('\n');

await fs.writeFile(path.join(androidDir, 'keystore.properties'), keystoreProperties, 'utf8');

let gradle = await fs.readFile(appBuildGradle, 'utf8');

if (!gradle.includes('REC_RELEASE_STORE_FILE')) {
  gradle = gradle.replace(
    /signingConfigs\s*\{\s*debug\s*\{/,
    `signingConfigs {
        release {
            if (project.hasProperty('REC_RELEASE_STORE_FILE')) {
                storeFile file(REC_RELEASE_STORE_FILE)
                storePassword REC_RELEASE_STORE_PASSWORD
                keyAlias REC_RELEASE_KEY_ALIAS
                keyPassword REC_RELEASE_KEY_PASSWORD
            }
        }
        debug {`
  );

  gradle = gradle.replace(
    /release\s*\{[^}]*signingConfig signingConfigs\.debug/,
    `release {
            signingConfig signingConfigs.release`
  );
}

const gradlePropertiesPath = path.join(androidDir, 'gradle.properties');
let gradleProperties = await fs.readFile(gradlePropertiesPath, 'utf8');

if (!gradleProperties.includes('REC_RELEASE_STORE_FILE')) {
  gradleProperties += `

REC_RELEASE_STORE_FILE=release.keystore
REC_RELEASE_KEY_ALIAS=${keyAlias}
REC_RELEASE_STORE_PASSWORD=${storePassword}
REC_RELEASE_KEY_PASSWORD=${keyPassword}
`;
}

await Promise.all([
  fs.writeFile(appBuildGradle, gradle, 'utf8'),
  fs.writeFile(gradlePropertiesPath, gradleProperties, 'utf8'),
]);

console.log('Configured Android release signing from CI secrets.');

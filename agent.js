import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

console.log('\n' + '━'.repeat(70));
console.log('🚀 IGISEM Marketing Agent Started');
console.log('━'.repeat(70));

console.log('\n📂 Chemin du .env:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('\n❌ ERREUR .env:', result.error.message);
} else {
  console.log('✅ .env chargé avec succès');
}

console.log('\n🔐 ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ CHARGÉE' : '❌ NON CHARGÉE');
console.log('📍 Mode: Production\n');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ERREUR: ANTHROPIC_API_KEY est vide!');
  process.exit(1);
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Tu es un agent marketing expert pour IGISEM.`;

async function generateMarketingContent(userMessage) {
  try {
    console.log('📝 Traitement...\n');

    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    console.log('\n' + '='.repeat(70));
    console.log('📋 RÉPONSE:');
    console.log('='.repeat(70) + '\n');

    if (response.content[0].type === 'text') {
      console.log(response.content[0].text);
    }

    console.log('\n✅ Exécution réussie!\n');

    return response.content[0].text;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

async function main() {
  try {
    const task1 = `Crée un dialogue d'orientation pour un bachelier en Sciences Économiques intéressé par la gestion d'entreprise.`;
    await generateMarketingContent(task1);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
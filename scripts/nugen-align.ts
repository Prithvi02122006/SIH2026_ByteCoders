/**
 * Nugen Alignment & Domain-Specific Model Setup Script
 * 
 * HackCelestial 3.0 Mandatory Requirement:
 * Base AI Model -> Nugen Alignment/Customization -> Domain-Specific Model -> Integration
 * 
 * Run with: npx tsx scripts/nugen-align.ts
 */

import fs from 'fs';
import path from 'path';
import { PAN_INDIA_EXPERIENCES } from '../src/data/panIndiaExperiences';
import { INITIAL_EXPERIENCES } from '../src/data/initialExperiences';
import { LOCAL_DEMAND_SIGNALS } from '../src/data/demandInsights';
import { PAN_INDIA_DEMAND_SIGNALS } from '../src/data/panIndiaDemand';

const API_BASE = 'https://api.nugen.in/api/v3';

// Load credentials from environment or fallback to hackathon provided key
const NUGEN_API_KEY = process.env.NUGEN_API_KEY || 'nugen-7a7694effe0ee97e';
const NUGEN_BASE_MODEL = process.env.NUGEN_BASE_MODEL || 'qwen-v2p5-0p5b-instruct';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateEnvFile(key: string, value: string) {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  let content = fs.readFileSync(envPath, 'utf8');
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}\n`;
  }
  fs.writeFileSync(envPath, content, 'utf8');
  console.log(`[Env] Updated ${key}=${value} in .env`);
}

/**
 * Step 1: Serialize domain data into plain text training documents
 */
function prepareTrainingData(): string[] {
  const trainingDir = path.resolve(process.cwd(), 'training-data');
  if (!fs.existsSync(trainingDir)) {
    fs.mkdirSync(trainingDir, { recursive: true });
  }

  // Doc 1: Pan-India Hospitality & Artisan Listings
  let panIndiaText = '=== PAN-INDIA HERITAGE & ARTISAN EXPERIENCES CORPUS ===\n\n';
  panIndiaText += 'This corpus contains verified local hospitality listings, craft ateliers, food walks, and heritage spaces across Indian cultural quarters.\n\n';
  for (const exp of PAN_INDIA_EXPERIENCES) {
    panIndiaText += `EXPERIENCE: ${exp.experience_title}\n`;
    panIndiaText += `Category: ${exp.category}\n`;
    panIndiaText += `City: ${exp.city_id || 'regional'} | Neighborhood: ${exp.neighborhood}\n`;
    panIndiaText += `Vendor: ${exp.vendor_name} (Est. ${exp.vendor_established || 'N/A'})\n`;
    panIndiaText += `Duration: ${exp.duration_minutes} minutes | Price: ₹${exp.price_per_head} / person | Capacity: ${exp.maximum_capacity}\n`;
    panIndiaText += `Specialty Tier: ${exp.specialty_tier} | Hours: ${exp.hours}\n`;
    panIndiaText += `Accessibility: Step-free=${exp.accessibility.step_free}, Wheelchair=${exp.accessibility.wheelchair}, Senior-paced=${exp.accessibility.senior_paced}, Low-sensory=${exp.accessibility.low_sensory}, Indoor=${exp.indoor}\n`;
    panIndiaText += `Tags: ${exp.tags.join(', ')}\n`;
    panIndiaText += `Teaser: ${exp.one_line_teaser}\n`;
    panIndiaText += `Full Description: ${exp.full_description}\n`;
    if (exp.offerings && exp.offerings.length > 0) {
      panIndiaText += `Offerings: ${exp.offerings.map(o => `${o.title} (₹${o.price}: ${o.description})`).join('; ')}\n`;
    }
    panIndiaText += `Editorial Review: ${exp.rating_summary?.editorial_note || 'Verified authentic offering.'}\n\n`;
  }
  const panIndiaFile = path.join(trainingDir, 'pan_india_experiences.txt');
  fs.writeFileSync(panIndiaFile, panIndiaText, 'utf8');

  // Doc 2: Initial Curated Heritage Experiences
  let initialText = '=== CURATED TRADITIONAL WORKSHOPS & TEAROOM EXPERIENCES ===\n\n';
  for (const exp of INITIAL_EXPERIENCES) {
    initialText += `EXPERIENCE: ${exp.experience_title}\n`;
    initialText += `Category: ${exp.category} | Neighborhood: ${exp.neighborhood}\n`;
    initialText += `Vendor: ${exp.vendor_name} (Est. ${exp.vendor_established})\n`;
    initialText += `Duration: ${exp.duration_minutes} minutes | Price: ₹${exp.price_per_head} | Capacity: ${exp.maximum_capacity}\n`;
    panIndiaText += `Accessibility: Step-free=${exp.accessibility.step_free}, Wheelchair=${exp.accessibility.wheelchair}, Senior-paced=${exp.accessibility.senior_paced}, Low-sensory=${exp.accessibility.low_sensory}\n`;
    initialText += `Teaser: ${exp.one_line_teaser}\n`;
    initialText += `Description: ${exp.full_description}\n`;
    initialText += `Review Note: ${exp.rating_summary?.editorial_note}\n\n`;
  }
  const initialFile = path.join(trainingDir, 'curated_experiences.txt');
  fs.writeFileSync(initialFile, initialText, 'utf8');

  // Doc 3: Demand Signals & Intent Mapping
  let demandText = '=== TRAVEL DEMAND SIGNALS & SEARCH INTENT MAPPING ===\n\n';
  demandText += 'Examples of how traveler natural search queries translate into accessibility, budget, and category intentions:\n\n';
  const allSignals = [...PAN_INDIA_DEMAND_SIGNALS, ...LOCAL_DEMAND_SIGNALS];
  for (const sig of allSignals) {
    demandText += `Demand Signal: ${sig.id}\n`;
    demandText += `Search Query Tags: ${sig.query_tags.join(', ')}\n`;
    demandText += `Category: ${sig.category} | Neighborhood: ${sig.neighborhood_focus}\n`;
    demandText += `Average Budget: ₹${sig.avg_budget_indicated} | Trend Growth: +${sig.trend_percentage}%\n`;
    demandText += `Accessibility Demand: ${sig.accessibility_demand}\n`;
    demandText += `Searches Count: ${sig.searches_count}\n\n`;
  }
  const demandFile = path.join(trainingDir, 'demand_signals.txt');
  fs.writeFileSync(demandFile, demandText, 'utf8');

  // Doc 4: Editorial Standards & Natural Language Prompt Guide
  let guideText = `=== EDITORIAL TRAVEL CONCIERGE & COPYWRITING GUIDELINES ===

TASK 1: NATURAL LANGUAGE INTENT EXTRACTION
When parsing traveler queries such as "cheap step-free pottery workshop tonight" or "authentic street food dinner under Rs 400":
- Identify category: food, culture, workshops, nightlife, hidden-gems, markets, or nature
- Identify budget tier: budget (<= ₹400), moderate (₹400-₹1200), or premium (> ₹1200)
- Identify physical accessibility needs: stepFree, wheelchair, seniorPaced, lowSensory
- Identify temporal urgency: openNowOnly (e.g., "tonight", "right now", "open now")
- Preserve core search keyword clean of filler words.

TASK 2: ITINERARY NARRATION
Write an unhurried, evocative 3-sentence editorial narration walkthrough. Connect consecutive stops by spatial and cultural harmony:
- Sentence 1: Morning/opening hub and first artisan engagement.
- Sentence 2: Midday progression into quiet workshops or regional food quarters.
- Sentence 3: Afternoon or twilight culmination with transit pace considerations.
Avoid marketing superlatives ("breathtaking", "unforgettable"). Prioritize architectural, sensory, and artisan precision.

TASK 3: VENDOR COPYWRITING ASSISTANT
Convert rough vendor bullet notes into:
- One-line teaser: Crisp, dignified 12-18 word summary highlighting materials, lineage, and setting.
- Full description: 2-3 sentences detailing workshop tools, tactile guest participation, and atelier heritage.
Strict prohibition: No emojis, no hashtags, no exclamation marks.

TASK 4: STOP SWAP REASONING
Explain in exactly one sentence why the replacement stop maintains neighborhood proximity, category continuity, and accessible transit flow.

TASK 5: ADAPTATION EXPLANATION
When rain, crowded venues, or timing delays occur, draft a calm, reassuring one-sentence explanation proposing the indoor or rescheduled alternative without alarm.
`;
  const guideFile = path.join(trainingDir, 'editorial_guidelines.txt');
  fs.writeFileSync(guideFile, guideText, 'utf8');

  console.log(`[Data Prep] Generated 4 training corpus documents in ${trainingDir}`);
  return [panIndiaFile, initialFile, demandFile, guideFile];
}

/**
 * Step 2: Upload documents to Nugen Documents API
 */
async function uploadDocuments(filePaths: string[]): Promise<string[]> {
  console.log('\n--- STEP 2: Uploading Domain Corpus to Nugen Platform ---');
  const documentIds: string[] = [];

  for (const filePath of filePaths) {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const blob = new Blob([fileContent], { type: 'text/plain' });

    const formData = new FormData();
    formData.append('files', blob, fileName);

    console.log(`Uploading ${fileName} (${fileContent.length} bytes)...`);
    const res = await fetch(`${API_BASE}/documents/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NUGEN_API_KEY}`
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to upload ${fileName}: HTTP ${res.status} - ${err}`);
    }

    const data: any = await res.json();
    const ids: string[] = data.document_ids || (data.document_id ? [data.document_id] : []);
    if (!ids || ids.length === 0) {
      throw new Error(`No document IDs returned for ${fileName}: ${JSON.stringify(data)}`);
    }

    console.log(`Uploaded ${fileName} -> Document ID: ${ids.join(', ')}`);
    documentIds.push(...ids);
  }

  // Poll status of all uploaded documents
  console.log('\nVerifying document processing status...');
  for (const docId of documentIds) {
    let ready = false;
    let attempts = 0;
    while (!ready && attempts < 30) {
      attempts++;
      const res = await fetch(`${API_BASE}/documents/${docId}/status`, {
        headers: { 'Authorization': `Bearer ${NUGEN_API_KEY}` }
      });
      if (res.ok) {
        const statusData: any = await res.json();
        if (statusData.status === 'READY') {
          console.log(`  Document ${docId}: READY`);
          ready = true;
          break;
        } else if (statusData.status === 'FAILED') {
          throw new Error(`Document ${docId} processing failed.`);
        }
      }
      await sleep(1500);
    }
    if (!ready) {
      console.warn(`  Warning: Document ${docId} did not become READY within timeout, proceeding.`);
    }
  }

  return documentIds;
}

/**
 * Step 3: Create Alignment Project on Nugen
 */
async function createAlignmentProject(documentIds: string[]): Promise<string> {
  console.log('\n--- STEP 3: Creating Nugen Alignment Project ---');
  const alignmentName = `hackcelestial-hospitality-domain-${Date.now().toString(36)}`;
  console.log(`Project Name: ${alignmentName}`);
  console.log(`Base Model ID: ${NUGEN_BASE_MODEL}`);
  console.log(`Document IDs: ${documentIds.join(', ')}`);

  const payload = {
    alignment_name: alignmentName,
    base_model_id: NUGEN_BASE_MODEL,
    document_ids: documentIds,
    description: 'Domain alignment for HackCelestial Pan-India artisan workshops and hospitality'
  };

  const res = await fetch(`${API_BASE}/alignment-projects/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NUGEN_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create alignment project: HTTP ${res.status} - ${err}`);
  }

  const data: any = await res.json();
  const alignmentId = data.alignment_id;
  console.log(`Created Alignment Project: ID = ${alignmentId}, initial status = ${data.status}`);
  return alignmentId;
}

/**
 * Step 4: Poll Alignment Project until COMPLETED
 */
async function pollAlignmentStatus(alignmentId: string): Promise<string> {
  console.log('\n--- STEP 4: Training & Aligning Domain-Specific Model ---');
  console.log('Polling alignment project progress...');

  let completed = false;
  let attempts = 0;
  let modelId = '';

  while (!completed && attempts < 120) {
    attempts++;
    await sleep(5000);

    const res = await fetch(`${API_BASE}/alignment-projects/${alignmentId}/status`, {
      headers: { 'Authorization': `Bearer ${NUGEN_API_KEY}` }
    });

    if (!res.ok) {
      console.warn(`[Poll ${attempts}] Status check failed: HTTP ${res.status}`);
      continue;
    }

    const data: any = await res.json();
    const status = data.status;
    const progress = data.progress !== undefined ? `${data.progress}%` : 'in progress';
    const eta = data.eta_seconds ? `(ETA: ${data.eta_seconds}s)` : '';

    console.log(`[Poll ${attempts}] Status: ${status} | Progress: ${progress} ${eta}`);

    if (status === 'READY' || status === 'COMPLETED' || status === 'SUCCESS') {
      completed = true;
      modelId = data.model_id || data.resulting_model_id || data.aligned_model_id;
      if (!modelId) {
        // Fetch full project details to get model_id
        const projRes = await fetch(`${API_BASE}/alignment-projects/${alignmentId}`, {
          headers: { 'Authorization': `Bearer ${NUGEN_API_KEY}` }
        });
        if (projRes.ok) {
          const pData: any = await projRes.json();
          modelId = pData.model_id || pData.resulting_model_id;
        }
      }
      console.log(`\n🎉 Alignment COMPLETED successfully! Resulting Model ID: ${modelId}`);
      break;
    } else if (status === 'FAILED') {
      throw new Error(`Alignment project ${alignmentId} failed: ${JSON.stringify(data)}`);
    }
  }

  if (!completed || !modelId) {
    throw new Error(`Alignment project did not finish within timeout.`);
  }

  return modelId;
}

/**
 * Step 5: Deploy the aligned model
 */
async function deployModel(modelId: string): Promise<void> {
  console.log(`\n--- STEP 5: Deploying Aligned Model ${modelId} ---`);

  const res = await fetch(`${API_BASE}/models/${modelId}/deployment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NUGEN_API_KEY}`
    }
  });

  if (!res.ok) {
    const err = await res.text();
    console.warn(`Deployment initiation notice: HTTP ${res.status} - ${err}`);
  } else {
    const data: any = await res.json();
    console.log(`Deployment requested:`, data);
  }

  // Poll deployment status
  console.log('Checking model deployment status...');
  let deployed = false;
  let attempts = 0;

  while (!deployed && attempts < 20) {
    attempts++;
    await sleep(4000);

    try {
      const statusRes = await fetch(`${API_BASE}/models/${modelId}/deployment/status`, {
        headers: { 'Authorization': `Bearer ${NUGEN_API_KEY}` }
      });

      if (statusRes.ok) {
        const sData: any = await statusRes.json();
        console.log(`[Deploy Poll ${attempts}] Deployment status:`, sData.status || sData);
        if (sData.status === 'READY' || sData.status === 'DEPLOYED' || sData.status === 'ACTIVE') {
          deployed = true;
          break;
        }
      } else {
        const text = await statusRes.text();
        console.log(`[Deploy Poll ${attempts}] Deployment status response:`, text);
      }
    } catch (e) {
      // Continue polling
    }
  }

  console.log(`\nModel ${modelId} deployment process initiated.`);
}

/**
 * Main execution
 */
async function main() {
  console.log('=====================================================');
  console.log(' HACKCELESTIAL 3.0: NUGEN INTELLIGENCE ALIGNMENT PIPELINE');
  console.log('=====================================================');
  console.log(`API Base: ${API_BASE}`);
  console.log(`Base Model: ${NUGEN_BASE_MODEL}`);

  try {
    // 1. Prepare training data
    const files = prepareTrainingData();

    // 2. Upload documents
    const documentIds = await uploadDocuments(files);

    // 3. Create alignment project
    const alignmentId = await createAlignmentProject(documentIds);

    // 4. Poll alignment project until model is ready
    const modelId = await pollAlignmentStatus(alignmentId);

    // 5. Deploy model
    await deployModel(modelId);

    // 6. Automatically record in .env
    updateEnvFile('NUGEN_ALIGNED_MODEL_ID', modelId);

    console.log('\n=====================================================');
    console.log(' NUGEN DOMAIN-SPECIFIC MODEL ALIGNMENT COMPLETE!');
    console.log('=====================================================');
    console.log(`Aligned Model ID: ${modelId}`);
    console.log(`Updated .env with NUGEN_ALIGNED_MODEL_ID=${modelId}`);
    console.log('You can now run inference with this specialized model.');
  } catch (error: any) {
    console.error('\n❌ Alignment Pipeline encountered an error:', error.message || error);
    process.exit(1);
  }
}

main();

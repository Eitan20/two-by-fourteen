import React, { useState } from 'react';
import { Loader2, Download, Edit2, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const SMSSequenceGenerator = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSequence, setIsGeneratingSequence] = useState(false);
  
  // Step 1 inputs
  const [businessName, setBusinessName] = useState('');
  const [differentiator, setDifferentiator] = useState('');
  const [email, setEmail] = useState('');
  
  // Step 2 generated data (editable)
  const [businessType, setBusinessType] = useState('');
  const [personalizationQ1, setPersonalizationQ1] = useState('');
  const [personalizationQ2, setPersonalizationQ2] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [whatWeOffer, setWhatWeOffer] = useState('');
  
  // Step 3 - Generated SMS sequence
  const [smsSequence, setSmsSequence] = useState([]);
  
  const [editMode, setEditMode] = useState(false);

  const generateBusinessDetails = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `You are an expert SMS marketing copywriter. Based on the following business information, generate the required fields for an SMS sequence campaign.

Business Name: ${businessName}
What Sets Them Apart: ${differentiator}

Generate the following in a JSON format:

{
  "businessType": "Brief description of what this business does (10 words max)",
  "personalizationQ1": "A question to ask leads about their main reason for needing the service (e.g., 'What's the main reason you're looking for tree trimming?')",
  "personalizationQ2": "A question to ask leads for qualification (e.g., 'Roughly how many trees are you concerned about?')",
  "painPoints": "5-7 common customer pain points, comma-separated (e.g., 'overgrown branches, ugly curb appeal, HOA notices, storm damage risk, safety concerns')",
  "whatWeOffer": "List of services this business offers, comma-separated (e.g., 'tree trimming, tree pruning, branch removal, fast service, one-day service')"
}

Keep the tone conversational and casual. Base everything on the differentiator: "${differentiator}"

CRITICAL: Respond ONLY with valid JSON. Do not include any text outside the JSON structure, including backticks or markdown formatting.`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      
      // Strip markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const generatedData = JSON.parse(responseText);
      
      setBusinessType(generatedData.businessType);
      setPersonalizationQ1(generatedData.personalizationQ1);
      setPersonalizationQ2(generatedData.personalizationQ2);
      setPainPoints(generatedData.painPoints);
      setWhatWeOffer(generatedData.whatWeOffer);
      
      setStep(2);
    } catch (error) {
      console.error("Error generating business details:", error);
      alert("Failed to generate business details. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSMSSequence = async () => {
    setIsGeneratingSequence(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `You are an expert SMS marketing copywriter. Create a 14-day SMS nurture sequence (2 messages per day: AM and PM) for the following business.

Business Name: ${businessName}
Business Type: ${businessType}
What Sets Them Apart: ${differentiator}
Pain Points: ${painPoints}
What We Offer: ${whatWeOffer}

Use the following example as a style guide. Match the casual, friendly, conversational tone:

STYLE EXAMPLES:
- "hey {{contact.first_name}}, it's Fast Tree Care. saw you were looking into tree trimming. what's the biggest headache with your trees right now?"
- "mornin' {{contact.first_name}}! a lot of people we help are just tired of looking at messy trees. is that kinda how you're feeling?"
- "{{contact.first_name}}, what if you could get those trees looking perfect without waiting weeks for a crew? our team specializes in one-day jobs. sound good?"

IMPORTANT REQUIREMENTS:
1. Use {{contact.first_name}} for personalization
2. Keep messages short and conversational (1-2 sentences max)
3. Use lowercase, casual language with contractions
4. End with questions to encourage responses
5. Build urgency gradually over the 14 days
6. Final message (Day 14 PM) should be a friendly breakup message
7. Incorporate the business's differentiator: "${differentiator}"
8. Reference the pain points: ${painPoints}
9. Mention services: ${whatWeOffer}

Generate exactly 28 messages (14 days × 2 messages per day).

Respond in this EXACT JSON format:
{
  "messages": [
    {"day": 1, "time": "AM", "message": "message text here"},
    {"day": 1, "time": "PM", "message": "message text here"},
    ...continue for all 14 days
  ]
}

CRITICAL: Respond ONLY with valid JSON. Do not include any text outside the JSON structure, including backticks or markdown formatting.`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      
      // Strip markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const generatedSequence = JSON.parse(responseText);
      
      setSmsSequence(generatedSequence.messages);
      setStep(3);
    } catch (error) {
      console.error("Error generating SMS sequence:", error);
      alert("Failed to generate SMS sequence. Please try again.");
    } finally {
      setIsGeneratingSequence(false);
    }
  };

  const downloadSequence = () => {
    let content = `# ${businessName} - 14-Day SMS Sequence\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    content += `## Business Information\n`;
    content += `**Business Type:** ${businessType}\n`;
    content += `**What Sets Us Apart:** ${differentiator}\n`;
    content += `**Pain Points:** ${painPoints}\n`;
    content += `**Services Offered:** ${whatWeOffer}\n\n`;
    content += `---\n\n`;
    content += `## SMS Sequence\n\n`;
    
    smsSequence.forEach((msg) => {
      content += `### DAY ${msg.day} - ${msg.time} MESSAGE:\n`;
      content += `${msg.message}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.replace(/\s+/g, '_')}_SMS_Sequence.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (businessName && differentiator && email) {
      generateBusinessDetails();
    }
  };

  const handleStep2Continue = () => {
    setEditMode(false);
    generateSMSSequence();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">SMS Sequence Generator</h1>
          <p className="text-slate-600">Create a 14-day SMS nurture campaign in minutes</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8 gap-2">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'} font-semibold`}>
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'} font-semibold`}>
            2
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'} font-semibold`}>
            3
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Business Information</h2>
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  BUSINESS NAME:
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Fast Tree Care"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  WHAT SETS YOU APART:
                </label>
                <input
                  type="text"
                  value={differentiator}
                  onChange={(e) => setDifferentiator(e.target.value)}
                  placeholder="e.g., Tree trimming in a day"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  EMAIL ADDRESS:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">We'll send you a copy of your SMS sequence</p>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Business Details
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Review & Edit Business Details */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Business Sequence Setup</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  BUSINESS NAME:
                </label>
                <input
                  type="text"
                  value={businessName}
                  disabled
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  BUSINESS TYPE:
                </label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  disabled={!editMode}
                  className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${editMode ? 'bg-white' : 'bg-slate-50'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  PERSONALIZATION QUESTION 1:
                </label>
                <input
                  type="text"
                  value={personalizationQ1}
                  onChange={(e) => setPersonalizationQ1(e.target.value)}
                  disabled={!editMode}
                  className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${editMode ? 'bg-white' : 'bg-slate-50'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  PERSONALIZATION QUESTION 2:
                </label>
                <input
                  type="text"
                  value={personalizationQ2}
                  onChange={(e) => setPersonalizationQ2(e.target.value)}
                  disabled={!editMode}
                  className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${editMode ? 'bg-white' : 'bg-slate-50'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  PAIN POINTS:
                </label>
                <input
                  type="text"
                  value={painPoints}
                  onChange={(e) => setPainPoints(e.target.value)}
                  disabled={!editMode}
                  placeholder="comma-separated list of customer pain points"
                  className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${editMode ? 'bg-white' : 'bg-slate-50'}`}
                />
                <p className="text-xs text-slate-500 mt-1">What are your customer's main pain points?</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  WHAT WE OFFER:
                </label>
                <input
                  type="text"
                  value={whatWeOffer}
                  onChange={(e) => setWhatWeOffer(e.target.value)}
                  disabled={!editMode}
                  placeholder="comma-separated list of services"
                  className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${editMode ? 'bg-white' : 'bg-slate-50'}`}
                />
                <p className="text-xs text-slate-500 mt-1">Your business's all services</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleStep2Continue}
                  disabled={isGeneratingSequence}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isGeneratingSequence ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating SMS Sequence...
                    </>
                  ) : editMode ? (
                    <>
                      <Check className="w-5 h-5" />
                      Save & Generate Sequence
                    </>
                  ) : (
                    <>
                      Generate SMS Sequence
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: SMS Sequence Results */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Your 14-Day SMS Sequence</h2>
              <button
                onClick={downloadSequence}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-700 mb-2">Campaign Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Business:</span>
                  <span className="ml-2 font-medium">{businessName}</span>
                </div>
                <div>
                  <span className="text-slate-600">Total Messages:</span>
                  <span className="ml-2 font-medium">{smsSequence.length}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Differentiator:</span>
                  <span className="ml-2 font-medium">{differentiator}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {smsSequence.map((msg, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-semibold text-sm text-slate-600 mb-1">
                    DAY {msg.day} - {msg.time} MESSAGE
                  </div>
                  <div className="text-slate-800 bg-slate-50 p-3 rounded">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Edit Business Details
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setBusinessName('');
                  setDifferentiator('');
                  setEmail('');
                  setSmsSequence([]);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Create New Sequence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSSequenceGenerator;
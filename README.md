# SMS Sequence Generator

An AI-powered tool that generates customized 14-day SMS marketing campaigns using Claude Sonnet 4.5. Perfect for service businesses looking to create engaging, conversational SMS nurture sequences.

## Features

- 🤖 **AI-Powered Generation**: Uses Claude Sonnet 4.5 to create personalized SMS campaigns
- 📱 **14-Day Sequence**: Generates 28 messages (2 per day: AM and PM)
- ✏️ **Editable Business Details**: Review and customize generated business information
- 💬 **Conversational Tone**: Matches casual, friendly style with questions to encourage engagement
- 📥 **Download Feature**: Export your sequence as a markdown file
- 🎯 **Pain Point Focused**: Targets customer pain points and highlights your differentiators

## How It Works

### Step 1: Enter Basic Information
- Business Name
- What Sets You Apart (your unique differentiator)
- Email Address

### Step 2: Review & Edit Business Details
AI generates and you can customize:
- Business Type
- Personalization Questions
- Customer Pain Points
- Services Offered

### Step 3: Get Your SMS Sequence
- Receive a complete 14-day campaign
- Download as a formatted markdown file
- Ready to import into your SMS marketing platform

## SMS Sequence Style

Messages follow these principles:
- Short and conversational (1-2 sentences)
- Casual language with contractions
- Questions to encourage responses
- Gradual urgency building
- Friendly breakup message on Day 14

### Example Messages:
```
DAY 1 - AM: hey {{contact.first_name}}, it's Fast Tree Care. saw you were looking into tree trimming. what's the biggest headache with your trees right now?

DAY 4 - PM: {{contact.first_name}}, imagine not worrying about those branches every time a storm rolls through. we can give you that peace of mind, fast. wanna hear how?

DAY 14 - PM: ok {{contact.first_name}}, i'm closing out your request. if you change your mind, you know how to reach me! wish you the best! 😊
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- React 18+
- Valid Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/sms-sequence-generator.git
cd sms-sequence-generator
```

2. Install dependencies:
```bash
npm install
```

3. Update the API key in `App.jsx`:
```javascript
// Replace with your API key
"x-api-key": "your-anthropic-api-key-here"
```

4. Start the development server:
```bash
npm start
```

## Technology Stack

- **React 18**: UI framework
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Claude Sonnet 4.5**: AI model for content generation
- **Anthropic API**: AI inference

## API Configuration

The app uses Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) with the following configuration:

```javascript
{
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 2000-4000,
  headers: {
    "x-api-key": "your-key",
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  }
}
```

## Usage Tips

1. **Be Specific**: The more specific your differentiator, the better the AI-generated content
2. **Review Everything**: Always review and edit the generated business details before creating the sequence
3. **Test Messages**: Test a few messages with real customers before deploying the full sequence
4. **Personalization**: The sequences use `{{contact.first_name}}` - make sure your SMS platform supports this variable

## Cost Considerations

Using Claude Sonnet 4.5 API:
- **Input tokens**: $3 per million tokens
- **Output tokens**: $15 per million tokens

Typical sequence generation costs:
- Business details generation: ~$0.01-0.02
- SMS sequence generation: ~$0.02-0.04
- **Total per sequence**: ~$0.03-0.06

## Example Use Cases

- Tree care services
- Home repair contractors
- Cleaning services
- Landscaping businesses
- HVAC companies
- Plumbing services
- Any local service business with a clear differentiator

## Security Notes

⚠️ **Important**: Never commit your API key to version control!

Store your API key securely:
1. Use environment variables
2. Use a `.env` file (add to `.gitignore`)
3. Use secrets management for production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your business or clients.

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

- [ ] Environment variable support for API key
- [ ] Multiple tone options (professional, friendly, urgent)
- [ ] Support for different sequence lengths (7-day, 21-day)
- [ ] Email sequence generation
- [ ] Integration with popular SMS platforms
- [ ] Multi-language support
- [ ] A/B testing version generator

## Acknowledgments

- Built with Claude Sonnet 4.5 by Anthropic
- Inspired by successful SMS marketing campaigns from service businesses
- Icon library: Lucide React

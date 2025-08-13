# OneDate - Modern Dating App

A sophisticated React-based dating application with professional design inspired by top technology companies.

## Features

- **Professional Dating Platform** with modern UI/UX design
- **Matching System** - Tinder-style swipe cards with animations
- **Events System** - Discover and join dating events
- **AI Dating Coach** - OpenAI-powered personal dating assistant
- **Profile Management** - Comprehensive user profiles
- **Chat/Messaging** - Real-time communication
- **Responsive Design** - Works seamlessly on all devices

## Technology Stack

- **Frontend**: React 19 with Material-UI
- **Styling**: Professional theme with sophisticated color palette
- **Animations**: Framer Motion for smooth interactions
- **AI Integration**: OpenAI GPT for dating coaching
- **Routing**: React Router for navigation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and add your OpenAI API key:
```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Image Assets
The app includes dedicated folders for organizing images:

- **User Photos**: `public/images/users/`
  - Upload user profile pictures here
  - Recommended size: 300x400px for main photos
  - Supported formats: JPG, PNG, WebP

- **Event Images**: `public/images/events/`
  - Upload event banner images here
  - Recommended size: 400x250px
  - Supported formats: JPG, PNG, WebP

### 4. Start Development Server
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Key Components

### Dashboard
- Modern welcome section with statistics
- Quick action buttons
- Recent matches and upcoming events
- AI Dating Coach integration
- Profile completion tracker

### AI Dating Coach
- OpenAI-powered personal assistant
- Conversation starters and dating advice
- Profile optimization tips
- Real-time chat interface
- Minimizable/expandable chat window

### Matching System
- Swipe-based matching with animations
- Profile compatibility scores
- Verification badges
- Photo carousel with indicators
- Like/pass actions with visual feedback

### Events System
- Categorized event discovery
- Featured event badges
- Event details with attendee information
- Join/leave functionality
- Responsive card layouts

### Profile Management
- Comprehensive profile editing
- Photo upload and management
- Professional information sections
- Lifestyle preferences
- Interest management system

## Design System

The app uses a sophisticated design system inspired by Fortune 500 companies:

- **Primary Color**: Sophisticated slate (#0F172A)
- **Secondary Color**: Modern indigo (#6366F1)
- **Typography**: SF Pro Display + Inter font stack
- **Spacing**: 8px base unit system
- **Borders**: Clean 8px border radius
- **Shadows**: Subtle professional shadow system

## Usage Tips

1. **Image Organization**: 
   - Place user photos in `public/images/users/`
   - Place event images in `public/images/events/`
   - Update image paths in components as needed

2. **OpenAI Integration**:
   - Obtain an API key from OpenAI
   - Add it to your `.env` file
   - The AI coach provides dating advice and conversation help

3. **Customization**:
   - Modify theme colors in `src/App.js`
   - Update component styles using Material-UI's sx prop
   - Add new features by creating components in appropriate folders

## File Structure

```
src/
├── components/
│   ├── Auth/          # Login and signup pages
│   ├── Dashboard/     # Main dashboard and AI chat
│   ├── Events/        # Event discovery and management
│   ├── Matching/      # Swipe-based matching system
│   ├── Navigation/    # App navigation components
│   ├── Profile/       # User profile management
│   └── Chat/          # Messaging components
├── App.js             # Main app component with theme
└── index.js           # App entry point

public/
└── images/
    ├── users/         # User profile photos
    └── events/        # Event banner images
```

## Contributing

1. Follow the established design patterns
2. Use the theme colors and spacing system
3. Ensure responsive design across all screen sizes
4. Test AI chat functionality with your OpenAI key
5. Maintain professional code quality

## License

This project is for educational and portfolio purposes.

---

Built with ❤️ using React and Material-UI

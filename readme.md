# How This PowerPuff Analyzer Mini App Works

## 🚀 Introduction

This project is a Farcaster Mini App built with Next.js that analyzes a user's Farcaster posts to determine which PowerPuff Girls character (Blossom, Bubbles, Buttercup, or Mojo Jojo) they are most like. It leverages the Coinbase OnchainKit (MiniKit) for Farcaster integration, Neynar API for fetching user casts, OpenAI API for sentiment and personality analysis, and Upstash Redis for notification management.

## 🛠️ Core Technologies

*   **Next.js 14+ App Router**: Frontend and backend framework.
*   **TypeScript**: For type safety.
*   **Tailwind CSS**: For styling.
*   **Coinbase OnchainKit (MiniKit)**: For Farcaster integration, user context, and frame actions.
*   **Neynar API**: To fetch user's Farcaster posts (casts).
*   **OpenAI API (gpt-4o-mini)**: For analyzing post content and matching to character profiles.
*   **Upstash Redis**: For storing notification preferences (optional, part of MiniKit template).
*   **Farcaster Frames**: For creating shareable rich embeds on Farcaster.

## 🌊 User Flow - Step-by-Step

1.  **Landing Page (`app/page.tsx`)**:
    *   The user opens the Mini App.
    *   The `Home` component initializes MiniKit (`useMiniKit`, `setFrameReady`).
    *   The `SentimentAnalyzer` component is displayed.

2.  **Connecting Farcaster Account**:
    *   The MiniKit handles wallet connection, which implicitly provides Farcaster user context (FID, username).
    *   The "Analyze My Posts!" button is disabled until `context?.user?.fid` is available.

3.  **Analyzing Posts**:
    *   User clicks "Analyze My Posts!".
    *   The `handleAnalyze` function in `components/sentiment-analyzer.tsx` is triggered.
    *   It makes a `POST` request to `/api/analyze-user` with the user's `fid`.

4.  **Backend Analysis (`/api/analyze-user`)**:
    *   The API route receives the `fid`.
    *   It fetches the user's 10 most popular casts from the Neynar API.
    *   The text from these casts is compiled.
    *   This text is sent to the OpenAI API (`gpt-4o-mini`) along with a detailed system prompt. The prompt instructs the AI to match the user's post content and tone to one of the predefined PowerPuff Girls character profiles (Blossom, Bubbles, Buttercup, Mojo Jojo).
    *   The AI returns the name of the best-matched character.
    *   The API route looks up the full character details (description, emoji, etc.) from `lib/characters.ts` and sends this back to the frontend.

5.  **Displaying Results**:
    *   The `SentimentAnalyzer` component receives the character data.
    *   It updates its state to display the `ResultScreen` sub-component, showing the character's image, name, and description.

6.  **Sharing the Result**:
    *   User clicks "Share Your Result!" on the `ResultScreen`.
    *   The `handleShare` function in `components/share-result-button.tsx` is triggered.
    *   It constructs a URL to a dynamic share page: `https://[your-app-url]/s/[characterName]` (e.g., `/s/Bubbles`).
    *   It uses `sdk.actions.composeCast` (from Farcaster Frame SDK) to open the Farcaster cast composer with pre-filled text and the share page URL as an embed.

7.  **Farcaster Frame Embed**:
    *   When the cast with the embedded URL (`/s/[characterName]`) is posted on Farcaster, Farcaster crawlers fetch this URL.
    *   The `app/s/[characterName]/page.tsx` route handles this request.
    *   Its `generateMetadata` function dynamically creates Farcaster frame metadata:
        *   `fc:frame`: Specifies it's a Farcaster frame.
        *   `fc:frame:image`: Points to another API route: `/api/generate-og-image?characterName=[name]&characterImage=[image_path]`. This URL will generate the dynamic image for the frame.
        *   `fc:frame:button:1`: A button on the frame.
        *   `fc:frame:button:1:action: "launch_frame"`: Specifies the button should launch a Mini App.
        *   `fc:frame:button:1:target`: Contains JSON defining the Mini App to launch (name, URL, splash image, etc.), pointing back to the main app.

8.  **Dynamic OG Image Generation (`/api/generate-og-image`)**:
    *   Farcaster (or other platforms) fetch the `fc:frame:image` URL.
    *   This API route receives `characterName` and `characterImage` (path to the static character image like `/bubbles.png`).
    *   It uses `ImageResponse` from `next/og` to generate a custom image on-the-fly.
    *   The image includes the character's picture, name, emoji, description, and a background color matching the character.
    *   This generated image is displayed in the Farcaster embed.

## 🛣️ Key Routes Explained

### 1. `app/page.tsx` (Main Page)
*   **Purpose**: The entry point of the Mini App.
*   **Functionality**:
    *   Initializes MiniKit using `useMiniKit()` and `setFrameReady()`.
    *   Displays the main UI, primarily the `SentimentAnalyzer` component.
    *   Includes themed header and footer.
    *   Has a pastel rainbow background with animated sparkles.

### 2. `app/api/analyze-user/route.ts` (Character Analysis API)
*   **Purpose**: To determine a user's PowerPuff Girl character based on their Farcaster posts.
*   **Method**: `POST`
*   **Request Body**: `{ fid: number }`
*   **Functionality**:
    1.  **Input Validation**: Checks for `NEYNAR_API_KEY`, `OPENAI_API_KEY`, and the presence of `fid` in the request.
    2.  **Fetch User Casts**:
        *   Makes a GET request to `https://api.neynar.com/v2/farcaster/feed/user/popular?fid=${fid}&limit=10` using the `NEYNAR_API_KEY`.
        *   Extracts the text content from the fetched casts.
        *   If no casts are found, defaults to "Bubbles".
    3.  **OpenAI Analysis**:
        *   Uses `generateText` from the `ai` SDK with the `openai("gpt-4o-mini")` model.
        *   **System Prompt**: A detailed prompt guides the AI:
            *   It defines the task: "You are a personality analyzer for PowerPuff Girls characters."
            *   It lists each character (Bubbles, Blossom, Buttercup, Mojo Jojo) with specific traits, typical post content, and example language patterns. This was refined to reduce bias towards any single character.
            *   It instructs the AI to "Respond with ONLY the character name that best matches the overall pattern."
        *   **User Prompt**: Contains the concatenated text of the user's posts.
        *   **Parameters**: `maxTokens: 15`, `temperature: 0.4` (slightly increased for more nuanced results).
    4.  **Map to Character Data**:
        *   The AI's response (e.g., "Blossom") is normalized (trimmed, lowercased).
        *   This name is used as a key to retrieve the full character object (name, emoji, description, color, trait) from `lib/characters.ts`.
        *   If the AI returns an unknown character name, it defaults to "Bubbles".
    5.  **Response**: Returns a JSON object `{ character: PowerPuffCharacter }` or an error object.
*   **Environment Variables Used**: `NEYNAR_API_KEY`, `OPENAI_API_KEY`.

### 3. `app/s/[characterName]/page.tsx` (Shareable Result Page & Frame)
*   **Purpose**: To provide a shareable URL that displays a Farcaster frame for a specific character result.
*   **Dynamic Segment**: `[characterName]` (e.g., `/s/Bubbles`).
*   **Functionality (`generateMetadata`)**:
    1.  **Character Lookup**: Decodes `params.characterName` and finds the corresponding character data from `lib/characters.ts`.
    2.  **Dynamic Image URL Construction**:
        *   Creates a URL for the `/api/generate-og-image` route.
        *   Appends `characterName` and the public path to the character's static image (e.g., `/bubbles.png`) as query parameters.
    3.  **Farcaster Frame Metadata (`fc:frame`)**:
        *   `version: "next"`
        *   `imageUrl`: Set to the dynamically constructed URL pointing to `/api/generate-og-image`.
        *   `button`:
            *   `title`: "I'm [Character Name]! Open Analyzer"
            *   `action`:
                *   `type: "launch_frame"`
                *   `name`: The Mini App's name (from env var).
                *   `url`: The Mini App's base URL (from env var).
                *   `splashImageUrl`, `splashBackgroundColor`: For the Mini App launch experience.
    4.  **OpenGraph Metadata**: Also includes standard OG tags (`og:title`, `og:description`, `og:image`) using the same dynamic image URL for compatibility with other platforms.
*   **Page Content (Fallback)**: If accessed directly in a browser, it displays a simple page showing the shared result and a button to go to the main app. This is primarily for users who might click the link outside of Farcaster.

### 4. `app/api/generate-og-image/route.tsx` (Dynamic OG Image API)
*   **Purpose**: To dynamically generate an OpenGraph image (used for Farcaster frames and social sharing) for a character result.
*   **Method**: `GET`
*   **Runtime**: `edge` (for faster image generation).
*   **Query Parameters**:
    *   `characterName`: The name of the PowerPuff Girl (e.g., "Bubbles").
    *   `characterImage`: The public path to the character's static image (e.g., "/bubbles.png").
*   **Functionality**:
    1.  **Input Validation**: Checks for `characterName` and `characterImage` in query params.
    2.  **Character Data**: Retrieves the full character object from `lib/characters.ts`.
    3.  **Image URL Construction**: Constructs an absolute URL for the static character image (e.g., `https://[your-app-url]/bubbles.png`) using the `baseUrl` and the provided `characterImagePublicPath`.
    4.  **Background Color**: Selects a background color based on the character.
    5.  **Image Generation with `ImageResponse`**:
        *   Uses `ImageResponse` from `next/og`.
        *   The JSX structure defines the image layout:
            *   A container `div` with the character-specific background color, border, and padding.
            *   An `<img>` tag for the character's static image, fetched using the absolute URL.
            *   An `<h1>` for "You are [Character Name]! [Emoji]" with custom styling (font, color, text shadow).
            *   A `<p>` tag for the character's description.
        *   **Dimensions**: 1200x630 pixels (standard OG image size).
    6.  **Response**: Returns the generated image.
*   **Key Dependencies**: `next/og` for `ImageResponse`.

### 5. `app/.well-known/farcaster.json/route.ts` (Farcaster Manifest)
*   **Purpose**: Provides the manifest file required by Farcaster to recognize and list the Mini App.
*   **Functionality**:
    *   Returns a JSON object containing:
        *   `accountAssociation`: For verifying app ownership (uses env vars).
        *   `frame`: Mini App details like `name`, `subtitle`, `description`, `iconUrl`, `splashImageUrl`, `homeUrl`, `webhookUrl`, etc., mostly populated from environment variables.

### 6. `app/api/webhook/route.ts` (Farcaster Webhooks)
*   **Purpose**: Handles webhook events sent by Farcaster (e.g., when a user adds/removes the app, enables/disables notifications).
*   **Functionality**:
    *   Verifies FID ownership using `verifyFidOwnership` (checks against Key Registry on Optimism).
    *   Decodes the webhook payload.
    *   Uses a `switch` statement to handle different event types (`frame_added`, `frame_removed`, `notifications_enabled`, `notifications_disabled`).
    *   For notification-related events, it interacts with Upstash Redis (via `lib/notification.ts`) to store or delete user notification details (`FrameNotificationDetails`).
    *   Can send a welcome notification using `sendFrameNotification` from `lib/notification-client.ts`.

## 🧩 Key Components & Functions

### 1. `components/sentiment-analyzer.tsx`
*   **`SentimentAnalyzer` Component**:
    *   Manages state for `loading`, `result`, and `error`.
    *   Uses `useMiniKit()` to get Farcaster user `context` (FID, etc.).
    *   **`handleAnalyze()` function**:
        *   Checks if `userFid` is available.
        *   Sets loading state.
        *   Makes a `POST` request to `/api/analyze-user` with the `fid`.
        *   Updates `result` or `error` state based on the API response.
    *   Conditionally renders:
        *   The initial analysis UI (title, "Analyze My Posts!" button).
        *   Loading state.
        *   Error messages.
        *   The `ResultScreen` component when `result` is available.
*   **`ResultScreen` Sub-Component**:
    *   Receives `result` (character data) and `onReset` function (to go back to the initial screen, though the "Analyze Again" button that used this was removed).
    *   Displays:
        *   A themed button showing "You're [Character Name]!".
        *   The character's image (from static assets like `/bubbles.png`).
        *   The character's description in a speech bubble style.
        *   The `ShareResultButton` component.

### 2. `components/share-result-button.tsx`
*   **`ShareResultButton` Component**:
    *   Receives `character` data and an `onReset` prop (currently unused as the reset button was removed).
    *   Manages `status` ("idle", "loading", "error") and `errorMessage`.
    *   **`handleShare()` function**:
        *   Sets loading state.
        *   Constructs the shareable URL: `https://[your-app-url]/s/[characterName]`.
        *   Composes a cast text (e.g., "I'm Bubbles! 💙 Which PowerPuff Girl are you?").
        *   Uses `sdk.actions.composeCast` from `@farcaster/frame-sdk` to open the Farcaster composer with the text and the share URL as an embed.
        *   Handles potential errors during cast composition.
    *   Renders a themed `PpgButton` for sharing, with dynamic text based on loading state.

### 3. `lib/characters.ts`
*   **Purpose**: Defines the data for each PowerPuff Girl character.
*   **Structure**: An object `characters` where keys are lowercase character names (e.g., "bubbles") and values are objects containing:
    *   `name`: (e.g., "Bubbles")
    *   `emoji`: (e.g., "💙")
    *   `color`: (e.g., "blue")
    *   `trait`: (e.g., "Sweet & Optimistic")
    *   `description`: A short paragraph about the character's personality.
*   This data is used by both the backend (to return full character details) and potentially the frontend (though currently, the frontend receives the full object from the backend).

### 4. `lib/notification.ts` & `lib/notification-client.ts`
*   **Purpose**: Manage Farcaster notification settings and sending notifications.
*   **`lib/notification.ts`**:
    *   Uses Upstash Redis (configured in `lib/redis.ts`).
    *   `getUserNotificationDetails(fid)`: Retrieves notification token and URL for a FID.
    *   `setUserNotificationDetails(fid, details)`: Stores notification details.
    *   `deleteUserNotificationDetails(fid)`: Deletes notification details.
*   **`lib/notification-client.ts`**:
    *   `sendFrameNotification({ fid, title, body })`: Sends a push notification to a user via their stored notification service URL and token.

## ⚙️ Environment Variables
*   Refer to `.env.example` for a full list. Key variables include:
    *   `NEYNAR_API_KEY`: For Farcaster data.
    *   `OPENAI_API_KEY`: For AI analysis.
    *   `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: For MiniKit.
    *   `REDIS_URL`, `REDIS_TOKEN`: For Upstash Redis (notifications).
    *   `NEXT_PUBLIC_URL`: The public URL of your deployed application.
    *   Various `NEXT_PUBLIC_APP_*` variables for Farcaster manifest and frame metadata.

## 🎨 Styling & Fonts
*   **Tailwind CSS**: Used for all styling, configured in `tailwind.config.ts`.
*   **`app/globals.css`**:
    *   Imports custom fonts (`Matemasie-Regular` for headings, `Quicksand-VariableFont_wght` for body text) using `@font-face`.
    *   Defines custom Tailwind utility classes for PowerPuff Girls themed text effects (e.g., `text-ppg-title`, `text-ppg-outline`).
    *   Sets up CSS variables for colors and default body/heading fonts.
*   **`components/ppg-button.tsx`**: A custom button component with PowerPuff Girls themed styles (colors, shadows, hover effects).

This document provides a comprehensive overview of how the PowerPuff Analyzer Mini App functions, from user interaction to backend processing and Farcaster Frame generation.
\`\`\`

This Markdown file should give a good overview of the project. You can download it and add it to your repository.

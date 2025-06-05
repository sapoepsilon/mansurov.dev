export const whisperaProject = {
	title: "Whispera",
	subtitle: "AI-Powered Voice Transcription App for macOS",
	slug: "whispera",
	description: "Whispera is a native macOS application that provides real-time AI-powered voice transcription using WhisperKit. Designed for seamless integration into macOS workflows with global shortcuts, menu bar access, and high-accuracy speech-to-text conversion.",
	problem: "macOS users often need quick, accurate voice transcription for notes, dictation, and documentation but lack a dedicated, always-accessible tool that integrates seamlessly with their system workflow.",
	solution: "Whispera provides a native macOS solution with global shortcuts, menu bar integration, and AI-powered transcription using WhisperKit, making voice-to-text conversion effortless and always available.",
	tech_stack: [
		"Swift",
		"SwiftUI", 
		"WhisperKit",
		"macOS SDK",
		"Xcode",
		"Core Audio",
		"Global Shortcuts API",
		"Menu Bar Integration"
	],
	features: [
		{
			title: "AI-Powered Transcription",
			description: "Leverages WhisperKit for high-accuracy speech-to-text conversion directly on your Mac.",
			icon: "🧠"
		},
		{
			title: "Global Shortcuts",
			description: "System-wide keyboard shortcuts for instant voice recording and transcription from any application.",
			icon: "⌨️"
		},
		{
			title: "Menu Bar Integration",
			description: "Always accessible from the macOS menu bar for quick and convenient voice transcription.",
			icon: "📍"
		},
		{
			title: "Native macOS Design",
			description: "Built with SwiftUI following Apple's design guidelines for a seamless native experience.",
			icon: "🍎"
		},
		{
			title: "Real-time Processing",
			description: "Instant voice-to-text conversion with live feedback and recording indicators.",
			icon: "⚡"
		},
		{
			title: "Privacy-First",
			description: "All processing happens locally on your device using WhisperKit - no data sent to external servers.",
			icon: "🔒"
		}
	],
	technical_highlights: [
		"Integrated WhisperKit framework for on-device AI speech recognition and transcription",
		"Implemented native macOS global shortcut system using Carbon and Cocoa APIs",
		"Built responsive SwiftUI interface following Apple Human Interface Guidelines",
		"Created efficient Core Audio pipeline for real-time voice recording and processing",
		"Developed modular architecture with separate components for audio, transcription, and UI",
		"Implemented menu bar integration using NSStatusItem for system-wide accessibility",
		"Optimized for macOS with proper memory management and efficient background processing",
		"Designed onboarding flow with user-friendly setup and configuration experience"
	],
	hero_image: "/whisper-statusbar.png",
	hero_video: "/whisper-demo.mov",
	gallery_images: [
		"/whisper-statusbar.png",
		"/whisper-models.png"
	],
	demo_url: undefined,
	github_url: "https://github.com/sapoepsilon/Whispera",
	published: true,
	featured: true,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString()
};
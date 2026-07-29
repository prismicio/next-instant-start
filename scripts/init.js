const { execSync } = require("node:child_process")
const { readFileSync } = require("node:fs")

const repositoryName = JSON.parse(
	readFileSync("prismic.config.json", "utf8"),
).repositoryName

function step(message, command) {
	console.log(message)
	try {
		if (Array.isArray(command)) {
			for (const cmd of command) {
				execSync(cmd, { stdio: "inherit" })
			}
		} else {
			execSync(command, { stdio: "inherit" })
		}
	} catch {
		process.exit(1)
	}
}

function prismic(command) {
	return `npx prismic@latest ${command}`
}

step("Installing dependencies...", "npm install")
step("Checking Prismic login...", prismic("whoami"))
step("Setting local simulator URL...", [
	prismic("preview remove https://next-instant-start.vercel.app/api/preview"),
	prismic("preview set-simulator http://localhost:3000"),
])

console.log(`
Your project is ready 🎉

Here's what you can do next:
• Start the development server: \`npm run dev\`
• Preview your live pages at https://${repositoryName}.prismic.io/builder

Start building 🚀

Read more about the Prismic CLI and AI skills:

• https://prismic.io/docs/ai
• https://prismic.io/docs/cli
`)

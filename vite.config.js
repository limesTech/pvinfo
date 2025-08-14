import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";
import svgrPlugin from "vite-plugin-svgr";
import * as child from "child_process";


// https://vitejs.dev/config/
// https://stackoverflow.com/questions/71162040/how-to-insert-git-info-in-environment-variables-using-vite
// https://stackoverflow.com/questions/70436753/how-to-add-commit-hash-into-reactjs-vite-config-js
export default defineConfig(({ command, mode }) => {
    let commitHash = "unknown";
    let commitDate = "unknown";
    
    try {
        commitHash = child.execSync("git rev-parse --short HEAD", { encoding: 'utf8' }).trim();
        commitDate = child.execSync("git log -1 --format='%ad' --date=short --date=format:'%m/%d/%Y'", { encoding: 'utf8' }).trim();
    } catch (error) {
        console.warn("Could not retrieve Git information:", error.message);
        commitHash = "Err: not a git repo";
        commitDate = "Err: not a git repo";
    }

    const env = loadEnv(mode, process.cwd(), '')
    return {
        envPrefix: 'REACT_APP_',
        // This changes the out put dir from dist to build
        // comment this out if that isn't relevant for your project
        build: {
            outDir: "build",
        },
        base: env.REACT_APP_ENDPOINT,
        plugins: [
            react(),
            envCompatible(),
            svgrPlugin({
                svgrOptions: {
                    icon: true,
                    // ...svgr options (https://react-svgr.com/docs/options/)
                },
            }),
        ],
        server: {
            host: "localhost",
            port: 3000,
            open: false,
            allowedHosts: true
        },
    };
})
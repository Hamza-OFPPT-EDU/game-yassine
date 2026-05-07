import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(command, cwd) {
  console.log(`Running: ${command} in ${cwd || process.cwd()}`);
  execSync(command, { stdio: 'inherit', cwd });
}

try {
  // Build main app
  run('npx vite build');

  // Build dashboard
  const dashboardDir = path.join(process.cwd(), 'dashboard');
  if (fs.existsSync(dashboardDir)) {
    run('npm run build', dashboardDir);
    
    // Copy dashboard dist to main dist/dashboard
    const srcDist = path.join(dashboardDir, 'dist');
    const destDist = path.join(process.cwd(), 'dist', 'dashboard');
    
    if (fs.existsSync(srcDist)) {
      if (!fs.existsSync(destDist)) {
        fs.mkdirSync(destDist, { recursive: true });
      }
      
      console.log(`Copying ${srcDist} to ${destDist}`);
      copyDir(srcDist, destDist);
    }
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

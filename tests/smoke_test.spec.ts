/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Frontend Smoke Tests', () => {
  /**
   * Verify critical package.json dependencies are installed
   */
  it('should have required npm packages installed', () => {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    const requiredDeps = [
      'react',
      'react-dom',
      'react-router',
      'vite',
      '@supabase/supabase-js',
      'tailwindcss',
      'framer-motion'
    ];

    requiredDeps.forEach(dep => {
      expect(packageJson.dependencies, `Missing dependency: ${dep}`).toHaveProperty(dep);
    });
  });

  /**
   * Verify build output was created successfully
   */
  it('should have dist folder with build artifacts', () => {
    const distPath = path.resolve(__dirname, '../dist');
    expect(fs.existsSync(distPath), 'dist folder does not exist').toBe(true);

    const requiredFiles = [
      'index.html',
      // JS and CSS files may have hash names, so just check folder exists
    ];

    requiredFiles.forEach(file => {
      expect(
        fs.existsSync(path.join(distPath, file)),
        `Missing build artifact: ${file}`
      ).toBe(true);
    });

    const assetFiles = fs.readdirSync(distPath).length;
    expect(assetFiles > 0, 'No build artifacts found in dist/').toBe(true);
  });

  /**
   * Verify TypeScript configuration is valid
   */
  it('should have valid TypeScript configuration', () => {
    const tsconfigPath = path.resolve(__dirname, '../tsconfig.json');
    expect(fs.existsSync(tsconfigPath), 'tsconfig.json not found').toBe(true);

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.target).toBeDefined();
  });

  /**
   * Verify Vite configuration exists
   */
  it('should have Vite configuration', () => {
    const vitePath = path.resolve(__dirname, '../vite.config.ts');
    expect(fs.existsSync(vitePath), 'vite.config.ts not found').toBe(true);
  });

  /**
   * Verify Tailwind CSS configuration exists
   */
  it('should have Tailwind CSS configuration', () => {
    const tailwindPath = path.resolve(__dirname, '../tailwind.config.js');
    expect(fs.existsSync(tailwindPath), 'tailwind.config.js not found').toBe(true);
  });

  /**
   * Verify critical source directories exist
   */
  it('should have source directory structure', () => {
    const srcPath = path.resolve(__dirname, '../src');
    expect(fs.existsSync(srcPath), 'src directory not found').toBe(true);

    const publicPath = path.resolve(__dirname, '../public');
    expect(fs.existsSync(publicPath), 'public directory not found').toBe(true);
  });

  /**
   * Verify environment can access window object (DOM available)
   */
  it('should have DOM environment available', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });

  /**
   * Verify build configuration for production
   */
  it('should have build scripts in package.json', () => {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    const requiredScripts = ['dev', 'build', 'test', 'lint'];
    requiredScripts.forEach(script => {
      expect(packageJson.scripts, `Missing script: ${script}`).toHaveProperty(script);
    });
  });
});

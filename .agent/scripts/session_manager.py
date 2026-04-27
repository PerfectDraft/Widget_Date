#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Session Manager - Antigravity Kit
=================================
Analyzes project state, detects tech stack, tracks file statistics, and provides
a summary of the current session.

Usage:
    python .agent/scripts/session_manager.py status [path]
    python .agent/scripts/session_manager.py info [path]
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List

# Force UTF-8 output so emoji render correctly in all terminals (incl. Antigravity)
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def get_project_root(path: str) -> Path:
    return Path(path).resolve()

def analyze_package_json(root: Path) -> Dict[str, Any]:
    pkg_file = root / "package.json"
    if not pkg_file.exists():
        return {"type": "unknown", "dependencies": {}}
    
    try:
        with open(pkg_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        deps = data.get("dependencies", {})
        dev_deps = data.get("devDependencies", {})
        all_deps = {**deps, **dev_deps}
        
        stack = []
        if "next" in all_deps: stack.append("Next.js")
        elif "react" in all_deps: stack.append("React")
        elif "vue" in all_deps: stack.append("Vue")
        elif "svelte" in all_deps: stack.append("Svelte")
        elif "express" in all_deps: stack.append("Express")
        elif "nestjs" in all_deps or "@nestjs/core" in all_deps: stack.append("NestJS")
        
        if "tailwindcss" in all_deps: stack.append("Tailwind CSS")
        if "prisma" in all_deps: stack.append("Prisma")
        if "typescript" in all_deps: stack.append("TypeScript")
        
        return {
            "name": data.get("name", "unnamed"),
            "version": data.get("version", "0.0.0"),
            "stack": stack,
            "scripts": list(data.get("scripts", {}).keys())
        }
    except Exception as e:
        return {"error": str(e)}

def count_files(root: Path) -> Dict[str, int]:
    stats = {"created": 0, "modified": 0, "total": 0}
    exclude = {".git", "node_modules", ".next", "dist", "build", ".agent", ".gemini", "__pycache__"}
    
    for root_dir, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in exclude]
        stats["total"] += len(files)
        
    return stats

def detect_features(root: Path) -> List[str]:
    features = []
    src = root / "src"
    if src.exists():
        possible_dirs = ["components", "modules", "features", "app", "pages", "services"]
        for d in possible_dirs:
            p = src / d
            if p.exists() and p.is_dir():
                for child in p.iterdir():
                    if child.is_dir():
                        features.append(child.name)
    return features[:10]

def list_agent_resources(root: Path) -> Dict[str, List[str]]:
    agent_dir = root / ".agent"
    result = {"agents": [], "skills": [], "workflows": []}

    for key in result:
        folder = agent_dir / key
        if folder.exists() and folder.is_dir():
            result[key] = sorted([
                f.stem if f.is_file() else f.name
                for f in folder.iterdir()
                if not f.name.startswith('.')
            ])
    return result

def print_status(root: Path):
    info = analyze_package_json(root)
    stats = count_files(root)
    features = detect_features(root)
    agent_res = list_agent_resources(root)
    
    print("\n=== Project Status ===")
    print(f"\n\U0001f4c1 Project: {info.get('name', root.name)}")
    print(f"\U0001f4c2 Path: {root}")
    print(f"\U0001f3f7\ufe0f  Type: {', '.join(info.get('stack', ['Generic']))}")
    print(f"\U0001f4ca Status: Active")
    
    print("\n\U0001f527 Tech Stack:")
    for tech in info.get('stack', []):
        print(f"   \u2022 {tech}")
        
    print(f"\n\u2705 Detected Modules/Features ({len(features)}):")
    for feat in features:
        print(f"   \u2022 {feat}")
    if not features:
        print("   (No distinct feature modules detected)")
        
    print(f"\n\U0001f4c4 Files: {stats['total']} total files tracked")

    print(f"\n\U0001f916 Agents ({len(agent_res['agents'])}):")
    for a in agent_res['agents']:
        print(f"   \u2022 @{a}")
    if not agent_res['agents']:
        print("   (No agents found)")

    print(f"\n\U0001f9e0 Skills ({len(agent_res['skills'])}):")
    for s in agent_res['skills']:
        print(f"   \u2022 {s}")
    if not agent_res['skills']:
        print("   (No skills found)")

    print(f"\n\u26a1 Workflows ({len(agent_res['workflows'])}):")
    for w in agent_res['workflows']:
        print(f"   \u2022 {w}")
    if not agent_res['workflows']:
        print("   (No workflows found)")

    print("\n====================\n")

def main():
    parser = argparse.ArgumentParser(description="Session Manager")
    parser.add_argument("command", choices=["status", "info"], help="Command to run")
    parser.add_argument("path", nargs="?", default=".", help="Project path")
    
    args = parser.parse_args()
    root = get_project_root(args.path)
    
    if args.command == "status":
        print_status(root)
    elif args.command == "info":
        print(json.dumps(analyze_package_json(root), indent=2))

if __name__ == "__main__":
    main()

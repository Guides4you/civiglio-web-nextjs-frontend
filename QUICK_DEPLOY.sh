#!/bin/bash

# ============================================
# 🚀 Quick Deploy Script - Civiglio Web Next.js
# ============================================
#
# Questo script ti guida attraverso il deployment su AWS Amplify
#
# PRIMA DI ESEGUIRE:
# 1. Crea repository su GitHub o AWS CodeCommit
# 2. Copia l'URL del repository
# 3. Esegui questo script
#
# Uso:
#   chmod +x QUICK_DEPLOY.sh
#   ./QUICK_DEPLOY.sh
#

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 Civiglio Web - Next.js Frontend Deployment                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Git repository not initialized"
    echo "   Run: git init"
    exit 1
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH'"
    echo "   Switching to 'main' branch..."
    git checkout main
fi

# Check if there's a commit
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
if [ "$COMMIT_COUNT" = "0" ]; then
    echo "❌ Error: No commits found"
    echo "   Run: git add . && git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository ready"
echo "   Branch: main"
echo "   Commits: $COMMIT_COUNT"
echo ""

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo "✅ Remote 'origin' already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   URL: $REMOTE_URL"
    echo ""

    read -p "❓ Do you want to push to this remote? [y/N] " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted by user"
        exit 1
    fi
else
    echo "❓ Choose repository provider:"
    echo "   1) GitHub"
    echo "   2) AWS CodeCommit"
    echo ""
    read -p "Enter choice [1-2]: " PROVIDER_CHOICE

    case $PROVIDER_CHOICE in
        1)
            echo ""
            echo "📋 STEP 1: Create repository on GitHub"
            echo "   1. Go to: https://github.com/new"
            echo "   2. Repository name: civiglio-web-nextjs-frontend"
            echo "   3. Private: ✓"
            echo "   4. DON'T initialize with README"
            echo "   5. Click 'Create repository'"
            echo ""
            read -p "❓ Have you created the repository? [y/N] " -n 1 -r
            echo ""

            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo "❌ Please create the repository first, then run this script again"
                exit 1
            fi

            echo ""
            read -p "📋 Enter your GitHub username: " GITHUB_USER

            if [ -z "$GITHUB_USER" ]; then
                echo "❌ Username cannot be empty"
                exit 1
            fi

            REMOTE_URL="https://github.com/$GITHUB_USER/civiglio-web-nextjs-frontend.git"

            echo ""
            echo "📋 Using repository URL:"
            echo "   $REMOTE_URL"
            echo ""

            git remote add origin "$REMOTE_URL"

            echo "✅ Remote added"
            ;;

        2)
            echo ""
            echo "📋 AWS CodeCommit Setup"
            echo ""
            echo "   Creating repository..."

            # Check if AWS CLI is available
            if ! command -v aws &> /dev/null; then
                echo "❌ AWS CLI not found"
                echo "   Install: https://aws.amazon.com/cli/"
                exit 1
            fi

            # Check AWS credentials
            if ! aws sts get-caller-identity &> /dev/null; then
                echo "❌ AWS credentials not configured"
                echo "   Run: aws configure"
                exit 1
            fi

            # Create repository
            REPO_OUTPUT=$(aws codecommit create-repository \
                --repository-name civiglio-web-nextjs-frontend \
                --repository-description "Civiglio Web - Next.js Frontend" \
                --region eu-west-1 2>&1)

            if [ $? -eq 0 ]; then
                echo "✅ Repository created on AWS CodeCommit"

                REMOTE_URL=$(echo "$REPO_OUTPUT" | grep -o '"cloneUrlHttp": "[^"]*"' | cut -d'"' -f4)

                git remote add origin "$REMOTE_URL"

                # Configure credential helper
                git config --global credential.helper '!aws codecommit credential-helper $@'
                git config --global credential.UseHttpPath true

                echo "✅ Remote added"
                echo "   URL: $REMOTE_URL"
            else
                if echo "$REPO_OUTPUT" | grep -q "RepositoryNameExistsException"; then
                    echo "⚠️  Repository already exists"

                    REMOTE_URL="https://git-codecommit.eu-west-1.amazonaws.com/v1/repos/civiglio-web-nextjs-frontend"

                    git remote add origin "$REMOTE_URL"

                    echo "✅ Remote added to existing repository"
                else
                    echo "❌ Error creating repository:"
                    echo "$REPO_OUTPUT"
                    exit 1
                fi
            fi
            ;;

        *)
            echo "❌ Invalid choice"
            exit 1
            ;;
    esac
fi

echo ""
echo "📤 Pushing to remote..."
echo ""

# Push main branch
echo "   Pushing 'main' branch..."
if git push -u origin main; then
    echo "   ✅ main branch pushed"
else
    echo "   ❌ Failed to push main branch"
    exit 1
fi

# Push staging branch if it exists
if git show-ref --verify --quiet refs/heads/staging; then
    echo "   Pushing 'staging' branch..."
    if git push -u origin staging; then
        echo "   ✅ staging branch pushed"
    else
        echo "   ⚠️  Failed to push staging branch (continuing...)"
    fi
else
    echo "   ⚠️  staging branch not found (skipping...)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Repository Push Complete!                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  Create AWS Amplify Hosting App"
echo "   → https://eu-west-1.console.aws.amazon.com/amplify/home?region=eu-west-1"
echo ""
echo "2️⃣  Click 'New app' → 'Host web app'"
echo ""
echo "3️⃣  Connect your repository:"
if [ "$PROVIDER_CHOICE" = "1" ]; then
    echo "   → Provider: GitHub"
    echo "   → Repository: civiglio-web-nextjs-frontend"
else
    echo "   → Provider: AWS CodeCommit"
    echo "   → Repository: civiglio-web-nextjs-frontend"
fi
echo "   → Branch: staging (for test)"
echo ""
echo "4️⃣  Add Environment Variables (IMPORTANT!)"
echo "   → Copy all variables from: .env.example"
echo "   → Total: 21 variables"
echo ""
echo "5️⃣  Click 'Save and deploy'"
echo ""
echo "6️⃣  Wait 5-10 minutes for deployment"
echo ""
echo "7️⃣  Test your app at:"
echo "   → https://staging.d[APP_ID].amplifyapp.com"
echo ""

echo "📖 For detailed instructions, see:"
echo "   → NEXT_STEPS.md"
echo "   → DEPLOYMENT_PREP.md"
echo ""

echo "🎉 Good luck with your deployment!"
echo ""

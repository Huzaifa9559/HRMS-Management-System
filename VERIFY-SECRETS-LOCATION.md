# How to Verify Secrets Location

## ⚠️ Important: Secrets Must Be in Production Environment

GitHub Actions has **two places** where you can store secrets:

1. **Repository-level secrets** - Available to all workflows
2. **Environment secrets** - Only available when workflow specifies that environment

## Your Workflow Uses: `environment: name: Production`

This means secrets **MUST** be in the **Production environment**, not repository-level.

## How to Check Where Your Secrets Are:

### Step 1: Check Repository-Level Secrets
1. Go to: `https://github.com/Huzaifa9559/HRMS-Management-System/settings/secrets/actions`
2. Look under **"Repository secrets"** section
3. If you see `DB_USER`, `DB_PASSWORD`, etc. here → **They're in the wrong place!**

### Step 2: Check Production Environment Secrets
1. Go to: `https://github.com/Huzaifa9559/HRMS-Management-System/settings/secrets/actions`
2. Click **"Environments"** tab (on the right side)
3. Click **"Production"** environment
4. Look under **"Environment secrets"** section
5. You should see `DB_USER`, `DB_PASSWORD`, etc. here

## If Secrets Are in Wrong Location:

### Option 1: Move Secrets to Production Environment (Recommended)
1. Copy the values from repository-level secrets
2. Go to **Environments** → **Production**
3. Add each secret to the Production environment
4. (Optional) Delete from repository-level after verifying they work

### Option 2: Check Environment Protection Rules
1. Go to **Environments** → **Production**
2. Check if there are any **"Required reviewers"** or **"Wait timer"** settings
3. These might prevent secrets from being accessed
4. Temporarily disable protection to test, then re-enable

## Quick Verification Checklist:

- [ ] Secrets are in **"Environments" → "Production"** (NOT repository-level)
- [ ] `DB_USER` exists in Production environment
- [ ] `DB_PASSWORD` exists in Production environment  
- [ ] `DB_NAME` exists in Production environment
- [ ] All secrets have non-empty values
- [ ] No environment protection rules blocking access

## What the Debug Output Will Show:

The updated workflow will now show:
- Which environment variables are available
- Whether each required secret is set (YES/NO)
- A list of all DB_* variables (masked)

This will help identify exactly what's missing.


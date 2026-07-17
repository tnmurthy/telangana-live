#!/bin/bash
# Setup script for telangana-live-agents

echo "================================================"
echo "Telangana.live Content Agent - Setup Script"
echo "================================================"
echo ""

# Check Python
echo "Checking Python..."
python --version

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
if [ "$OSTYPE" == "msys" ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

# Create logs directory
echo ""
echo "Creating logs directory..."
mkdir -p logs

# Copy env example
echo ""
echo "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ .env created. Please fill in your credentials:"
    echo "  - OPENAI_API_KEY"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_KEY"
    echo "  - SUPABASE_SERVICE_KEY"
else
    echo "✓ .env already exists"
fi

echo ""
echo "================================================"
echo "Setup complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Edit .env with your credentials"
echo "2. Run Supabase schema: supabase-schema.sql"
echo "3. Test with: python main.py"
echo "4. Start scheduler: python scheduler.py"
echo ""

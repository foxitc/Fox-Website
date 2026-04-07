#!/bin/bash
# Fox ITC Website Deployment Script
# Run on VPS: 217.182.170.69

set -e

echo "=== Fox ITC Website Deployment ==="

# Create directory
mkdir -p /opt/foxitc-site
cd /opt/foxitc-site

# Extract (assumes foxitc-site.zip uploaded to /opt/foxitc-site/)
if [ -f "foxitc-site.zip" ]; then
    unzip -o foxitc-site.zip
else
    echo "ERROR: Upload foxitc-site.zip to /opt/foxitc-site/ first"
    exit 1
fi

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt

# Install systemd service
cp foxitc-site.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable foxitc-site
systemctl restart foxitc-site

# Check status
sleep 2
systemctl status foxitc-site --no-pager

echo ""
echo "=== DONE ==="
echo "Site running on http://localhost:8055"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. TEST IT: curl http://localhost:8055/api/health"
echo ""
echo "2. CLARITY TRACKING:"
echo "   - Go to https://clarity.microsoft.com"
echo "   - Create new project for foxitc.co.uk"
echo "   - Copy the Project ID"
echo "   - Edit: nano /etc/systemd/system/foxitc-site.service"
echo "   - Set: CLARITY_PROJECT_ID=your_id_here"
echo "   - Run: systemctl daemon-reload && systemctl restart foxitc-site"
echo ""
echo "3. ODOO LIVE CHAT:"
echo "   - In Odoo: Apps → Install 'Live Chat'"
echo "   - Settings → Live Chat → Create channel"
echo "   - Widget auto-appears on site"
echo ""
echo "4. DNS (when ready):"
echo "   - Point foxitc.co.uk A record to this server"
echo "   - Run: certbot --nginx -d foxitc.co.uk -d www.foxitc.co.uk"
echo ""

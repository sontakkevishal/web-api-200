#!/bin/bash

# Remind user to shut down Visual Studio
echo "================================================"
echo "IMPORTANT: Please shut down Visual Studio now!"
echo "================================================"
read -p "Press Enter when Visual Studio is completely closed..."

# Ask if user wants to keep existing code
read -p "Would you like to keep your existing code as a backup? (y/n): " keep_code

if [[ "$keep_code" == "y" || "$keep_code" == "Y" ]]; then
    echo "Backing up src/SoftwareSolution to src/SoftwareSolutionBak..."
    if [ -d "src/SoftwareSolution" ]; then
        rm -rf src/SoftwareSolutionBak
        cp -r src/SoftwareSolution src/SoftwareSolutionBak
        echo "Backup complete!"
    else
        echo "Warning: src/SoftwareSolution directory not found. Skipping backup."
    fi
fi

# Delete existing SoftwareSolution
echo "Removing src/SoftwareSolution..."
rm -rf src/SoftwareSolution

# Pull instructor code
echo "Pulling instructor code..."
./pull-instructor-code.sh

# Copy instructor code to src/SoftwareSolution
echo "Copying instructor code to src/SoftwareSolution..."
if [ -d "../instructor-code/src/SoftwareSolution" ]; then
    cp -r ../instructor-code/src/SoftwareSolution src/SoftwareSolution
    echo "Code reset complete!"
else
    echo "Error: ../instructor-code/src/SoftwareSolution not found!"
    exit 1
fi

echo "================================================"
echo "Done! You can now reopen Visual Studio."
echo "================================================"

@echo off
echo Cleaning build artifacts...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
echo Build artifacts cleaned successfully!

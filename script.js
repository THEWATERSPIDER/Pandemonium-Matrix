document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const calculateBtn = document.getElementById('calculate-btn');
    const outputResult = document.getElementById('output-result');
    const loadingIndicator = document.getElementById('loading');

    // AQ Gematria cipher: A=10, B=11, C=12...Z=35
    function getAQValue(char) {
        if (/[A-Z]/.test(char)) {
            return char.charCodeAt(0) - 55; // A is 65 in ASCII, 65-55=10
        }
        return 0;
    }

    // Calculate gematria value for a word
    function calculateGematria(word) {
        return word.split('').reduce((sum, char) => sum + getAQValue(char), 0);
    }

    // Reduce a number to a single digit
    function reduceToSingleDigit(num) {
        while (num > 9) {
            num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    // Calculate Net Spans for a gematria value
    function calculateNetSpans(gematriaValue) {
        const digits = gematriaValue.toString().split('').map(Number);
        
        // Method 1: Sum of all digits (reduced if necessary)
        let sum1 = digits.reduce((a, b) => a + b, 0);
        let netSpan1 = reduceToSingleDigit(sum1) + "::0";
        
        // Method 2: (Sum of first n-1 digits) + last digit
        if (digits.length > 1) {
            const firstGroup = digits.slice(0, -1).reduce((a, b) => a + b, 0);
            const lastDigit = digits[digits.length - 1];
            let netSpan2 = firstGroup + "::" + lastDigit;
            
            // Method 3: First digit + (sum of remaining digits)
            const firstDigit = digits[0];
            const remainingSum = digits.slice(1).reduce((a, b) => a + b, 0);
            let reducedSum = reduceToSingleDigit(remainingSum);
            let netSpan3 = firstDigit + "::" + reducedSum;
            
            return [
                {
                    netSpan: netSpan1,
                    calculation: `Sum of digits: ${digits.join('+')}=${sum1}` + 
                                (sum1 > 9 ? ` → ${sum1.toString().split('').join('+')}=${reduceToSingleDigit(sum1)}` : '')
                },
                {
                    netSpan: netSpan2,
                    calculation: `First group + last digit: (${digits.slice(0, -1).join('+')})+(${lastDigit})=${firstGroup}+${lastDigit}`
                },
                {
                    netSpan: netSpan3,
                    calculation: `First digit + remaining sum: ${firstDigit}+(${digits.slice(1).join('+')})=${firstDigit}+${remainingSum}` + 
                                (remainingSum > 9 ? ` → ${firstDigit}+${reducedSum}` : '')
                }
            ];
        } else {
            // If only one digit
            return [{ netSpan: netSpan1, calculation: `Single digit: ${digits[0]}` }];
        }
    }

    // Format the output
    function formatOutput(word, gematriaValue, netSpans) {
        let output = `WORD: <span class="gematria-value">${word}</span>\n`;
        output += `AQ GEMATRIA: <span class="gematria-value">${gematriaValue}</span>\n\n`;
        output += `NET SPAN ANALYSIS:\n`;
        
        netSpans.forEach((item, index) => {
            output += `${index + 1}. <span class="calculation-step">${item.calculation}</span>\n`;
            output += `   Net Span <span class="net-span">${item.netSpan}</span>`;
            
            const entity = pandemoniumMatrix[item.netSpan];
            if (entity) {
                output += ` - <span class="entity-name">${entity.name}</span>\n`;
                output += `   <span class="entity-description">"${entity.description}"</span>\n`;
            } else {
                output += ` - <span class="entity-name">Unknown Entity</span>\n`;
            }
            output += '\n';
        });
        
        return output;
    }

    // Handle calculation
    function performCalculation() {
        const text = inputText.value.trim().toUpperCase();
        
        if (!text) {
            outputResult.innerHTML = 'ERROR: PLEASE ENTER A WORD OR PHRASE';
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        outputResult.innerHTML = '';
        
        // Simulate processing delay for cyberpunk effect
        setTimeout(() => {
            // Filter out non-alphabetic characters
            const filteredText = text.replace(/[^A-Z]/g, '');
            
            // Calculate gematria
            const gematriaValue = calculateGematria(filteredText);
            
            // Calculate Net Spans
            const netSpans = calculateNetSpans(gematriaValue);
            
            // Format and display output
            outputResult.innerHTML = formatOutput(filteredText, gematriaValue, netSpans);
            
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
        }, 800);
    }

    // Event listeners
    calculateBtn.addEventListener('click', performCalculation);
    inputText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performCalculation();
        }
    });

    // Focus input on load
    inputText.focus();
});

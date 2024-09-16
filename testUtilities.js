let testCompare = (testLabel, expected, actual, failureMessage = "FAIL!!!", successMessage = "Pass" ) => {
    let outputDiv = document.getElementById("output");
    if (expected === actual) {
        outputDiv.insertAdjacentHTML('beforeend', `<span class="fontGreen">${successMessage}</span> - ${testLabel}</br>`);
        return true;
    } else {
        outputDiv.insertAdjacentHTML('beforeend', `<span class="fontRed fontBold">${failureMessage}</span> - ${testLabel} - expected(${expected}), actual(${actual})</br>`);
        return false;
    }
}

let testLabel = (labelToDisplay) => {
    let outputDiv = document.getElementById("output");
    outputDiv.insertAdjacentHTML('beforeend', `</br><span class="fontBold fontUnder">${labelToDisplay}</span></br>`);
}
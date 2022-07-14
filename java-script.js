$('#addEntropyInp').click(function () {

    let featureNum = $('#feature-amount').val();
    let parent = $('#createInput');
    parent.empty();

    if (featureNum != '') {
        for (i = 0; i < featureNum; i++) {
            $('<input>').attr({
                type: 'number',
                class: 'input level-inp',
                id: `level-${i}`,
                placeholder: `Amount of level ${i+1}`
            }).appendTo(parent);
        }
        $(".calculateBtn").show();

    } else {
        alert('Please enter all field');
    }

});


$('#entropyCalc').click(function () {
    let totalData = $('#data-amount').val();
    let tFeatureAmount = $('#feature-amount').val();
    let levelProbability = [],
        forLevel = [],
        entropy = 0;
    let isEmpty = inputEmptyCheck(tFeatureAmount);

    if (isEmpty == false) {
        $('#result').addClass('result');
        let result1 = $('#result1');
        let result2 = $('#result2');
        let finalResult = $('#final-result');

        result1.empty();
        result2.empty();
        finalResult.empty();
        result1.append('=> -(');
        result2.append('=> -(');

        for (i = 0; i < tFeatureAmount; i++) {
            let levelAmount = $(`#level-${i}`).val();
            levelProbability[i] = levelAmount / totalData;
            forLevel[i] = (levelProbability[i] * Math.log2(levelProbability[i]));
            entropy -= forLevel[i];

            if (i < (tFeatureAmount - 1)) {
                result1.append(`(${levelAmount}/${totalData} &#215; log<sub>2</sub>(${levelAmount}/${totalData})) + `);
                result2.append(`(${forLevel[i].toFixed(4)}) + `);

            } else {
                result1.append(`(${levelAmount}/${totalData} &#215; log<sub>2</sub>(${levelAmount}/${totalData})))`);
                result2.append(`(${forLevel[i].toFixed(4)}))`);
            }
        }
        //Final result
        finalResult.append(`<b>Final Result (Entropy) = ${entropy}</b>`);

    } else {
        alert('Please enter all (' + tFeatureAmount + ') target feature levels')
    }

});


function inputEmptyCheck(n) {
    let count = 0;
    for (i = 0; i < n; i++) {
        if ($(`#level-${i}`).val() == '') {
            count += 1;
        }
    }

    if (count > 0) {
        return true;
    } else {
        return false;
    }

}

//............................................

$('#addReminderInp').click(function () {

    let totalData = $('#total-data').val();
    let featureNum = $('#ds-feature-amount').val(); //input - amount of feature
    let featureSubNum = $('#ds-feature-sub-amount').val(); //textbox - amount of sub-feature
    let parent = $('#createRemInput');
    parent.empty();

    let featureSub = featureSubNum.split(",").map((num) => { //feature sub amount array
        return +num;
    });
    let inputCheck = levelInputCheck(featureNum, featureSub);

    if (totalData != '' && featureNum != '' && inputCheck == true) {
        for (i = 0; i < featureNum; i++) {
            $('<input>').attr({
                type: 'number',
                class: 'input level-inp',
                id: `level-${i}`,
                placeholder: `Amount of level ${i+1}`
            }).appendTo(parent);

            for (j = 0; j < featureSub[i]; j++) {
                $('<input>').attr({
                    type: 'number',
                    class: 'input sub-level-inp',
                    id: `sub-level-${i}-${j}`,
                    placeholder: `Sub level ${j+1}`
                }).appendTo(parent);
            }
        }
        $(".calculateBtn").show();

    } else {
        alert('Please enter all field(1,2,3). Descriptive feature (field 2) & sub levels (field 3) should be match and every value of field 3 must be grater than 0');
    }

});



$('#reminderCalc').click(function () {

    let entropy = $('#entropy-value').val();
    let totalData = $('#total-data').val();
    let dsFeatureAmount = $('#ds-feature-amount').val();
    let featureSubNum = $('#ds-feature-sub-amount').val();
    let featureSub = featureSubNum.split(",").map((num) => { //feature sub amount array
        return +num;
    });

    let levelProbability = [],
        forLevel = [],
        subLevelProbability = [],
        forSubLevel,
        prEntropy = 0,
        reminder = 0,
        ig;

    $('#rm-result').addClass('result');
    let result1 = $('#rm-result1');
    let result2 = $('#rm-result2');
    let result3 = $('#rm-result3');
    let finalResult = $('#rm-final-result');

    result1.empty();
    result2.empty();
    result3.empty();
    finalResult.empty();
    result1.append('&#10132; ');
    result2.append('&#10132; ');
    result3.append('&#10132; ');

    for (i = 0; i < dsFeatureAmount; i++) {

        let levelAmount = $(`#level-${i}`).val();
        levelProbability[i] = levelAmount / totalData;
        //..................................result..........................
        let firstResult = 0;
        let result_12_c1 = `(${levelAmount}/${totalData} &#215; (-(`;
        let result_12_c2 = `<br> + (${levelAmount}/${totalData} &#215; (-(`;

        if (firstResult == i) {
            result1.append(result_12_c1);
            result2.append(result_12_c1);
            result3.append(`(${levelAmount}/${totalData} &#215; `);
        } else {
            result1.append(result_12_c2);
            result2.append(result_12_c2);
            result3.append(` + (${levelAmount}/${totalData} &#215; `);
        }

        for (j = 0; j < featureSub[i]; j++) {

            let subLevelAmount = $(`#sub-level-${i}-${j}`).val();
            subLevelProbability[j] = subLevelAmount / levelAmount;
            forSubLevel = (subLevelProbability[j] * Math.log2(subLevelProbability[j]));
            if (isNaN(forSubLevel)) forSubLevel = 0;
            prEntropy -= forSubLevel;
            //...........................................................result...................................................
            if (j < (featureSub[i] - 1)) {
                result1.append(`(${subLevelAmount}/${levelAmount} &#215; log<sub>2</sub>(${subLevelAmount}/${levelAmount})) + `);
                result2.append(`(${forSubLevel.toFixed(4)}) + `);

            } else {
                result1.append(`(${subLevelAmount}/${levelAmount} &#215; log<sub>2</sub>(${subLevelAmount}/${levelAmount})))))`);
                result2.append(`(${forSubLevel.toFixed(4)}))))`);
            }
        }

        forLevel[i] = levelProbability[i] * prEntropy;
        reminder += forLevel[i];

        //.................result...................
        result3.append(`(${prEntropy.toFixed(4)}))`);
        //set previous value to 0
        prEntropy = 0;
        firstResult = 1;

    }

    ig = entropy - reminder;
    //..........................Finall result..........................
    finalResult.append(`Reminder = <b>${reminder}</b>`);
    $('#ig-result').append(`Information Gain = (${entropy} - (${reminder.toFixed(4)})) <br> => <b>${ig}</b> <br>`);

});


function levelInputCheck(dsF, subF) {
    if (dsF == subF.length) {
        if (subF.includes(0) == true) {
            return false;
        } else {
            return true;
        }

    } else {
        return false;
    }
}





//K-fold cross-validation

$('#kFoldCalculation').click(function () {

    let m1input = $('#m1-input').val();
    let m2input = $('#m2-input').val();

    let m1Data = m1input.split(",").map((num) => {
        return +num;
    });

    let m2Data = m2input.split(",").map((num) => {
        return +num;
    });

    if (m1Data != '' && m1input != '') {
        if (m1Data.length == m2Data.length) {

            let m1_sum, m2_sum, m1_avg, m2_avg, m1_m2_sub, m1m2SubArr = [];

            m1_sum = m1Data.reduce((a, b) => a + b);
            m2_sum = m2Data.reduce((a, b) => a + b);
            m1_avg = (m1_sum / (m1Data.length)).toFixed(3);
            m2_avg = (m2_sum / (m2Data.length)).toFixed(3);

            //Result
            let errm1Bar = '<span class="putBar">err</span>(M1)';
            let errm2Bar = '<span class="putBar">err</span>(M2)';
            let dBar = '<span class="putBar">d</span>';

            $('.fade-img').fadeIn();
            $('#k-fold-result').addClass('result');
            let m1avgresult = $('#m1-avg-result');
            let m2avgresult = $('#m2-avg-result');
            m1avgresult.empty();
            m2avgresult.empty();

            //m1, m2 average
            m1avgresult.append(`${errm1Bar} : ((`)
            for (i = 0; i < m1Data.length; i++) {
                if (i == (m1Data.length - 1)) {
                    m1avgresult.append(`${m1Data[i]}`);
                } else {
                    m1avgresult.append(`${m1Data[i]} + `);
                }
            }
            m1avgresult.append(`) &div; ${m1Data.length}) <br><br>`);
            m1avgresult.append(`${errm1Bar} : (${m1_sum} &div; ${m1Data.length}) = ${m1_avg}`);


            m2avgresult.append(`${errm2Bar} : ((`)
            for (i = 0; i < m2Data.length; i++) {
                if (i == (m2Data.length - 1)) {
                    m2avgresult.append(`${m2Data[i]}`);
                } else {
                    m2avgresult.append(`${m2Data[i]} + `);
                }
            }
            m2avgresult.append(`) &div; ${m2Data.length}) <br><br>`);
            m2avgresult.append(`${errm2Bar} : (${m2_sum} &div; ${m2Data.length}) = ${m2_avg}`);

            //m1, m2 average sub
            let dBarValue = (m1_avg - m2_avg).toFixed(3);
            let errordiffresult = $('#error-diff-result');
            errordiffresult.empty();
            errordiffresult.append(`${dBar} : ${errm1Bar} - ${errm2Bar} <br><br>`);
            errordiffresult.append(`${dBar} : (${m1_avg} - ${m2_avg}) <br><br>`);
            errordiffresult.append(`${dBar} : ${dBarValue}`);


            //STD
            let standard_deviation, std_sub, std_sub2;
            let stdresult1 = $('#std1');
            let stdresult = $('#std-result');
            stdresult1.empty();
            stdresult.empty();

            stdresult1.append('Standard Deviation Calculation: <br><br>')
            for (i = 0; i < m1Data.length; i++) {
                m1_m2_sub = (m1Data[i] - m2Data[i]);
                m1m2SubArr[i] = (m1_m2_sub.toFixed(2));

                std_sub = (stdPart1(m1m2SubArr[i], dBarValue)).toFixed(3); // (value - length)^2
                stdresult1.append(`(${m1m2SubArr[i]} - ${dBarValue})<sup>2</sup> = ${std_sub} <br><br>`);
            }

            std_sub2 = (stdPart2(m1m2SubArr, dBarValue)).toFixed(3); // Summation
            stdresult1.append(`Summation: ${std_sub2}`);

            standard_deviation = (std(m1m2SubArr, dBarValue)).toFixed(3); // Standard deviation
            stdresult.append(`Standard Deviation : &radic;(${std_sub2} &div; ${m1Data.length}) = ${standard_deviation}`);

            //Final Result
            let kfold = $('#k-fold');
            kfold.empty();

            let sdpart, kfold_result;
            sdpart = (standard_deviation / Math.sqrt(m1Data.length));
            kfold_result = (dBarValue / sdpart).toFixed(3);
            kfold.append(`t = (${dBarValue} &div; (${standard_deviation} &div; &radic;${m1Data.length})) <br><br>`);
            kfold.append(`t = ${kfold_result}`);


        } else {
            alert('M1 and M2 must be same length');
        }
    } else {
        alert('Please enter all field')
    }


});


function std(arr, dbarVal) {
    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k) => {
        return (k - dbarVal) ** 2;
    })

    // Calculating the sum of updated array
    let sum = arr.reduce((acc, curr) => acc + curr, 0);

    // Calculating the variance
    let variance = sum / arr.length;

    // Returning the Standered deviation
    return Math.sqrt(variance);

}



function stdPart1(arrVal, dbarVal) {
    return (arrVal - dbarVal) ** 2;

}


function stdPart2(arr, dbarVal) {
    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k) => {
        return (k - dbarVal) ** 2;
    })

    // Calculating the sum of updated array
    let sum = arr.reduce((acc, curr) => acc + curr, 0);
    return sum;

}
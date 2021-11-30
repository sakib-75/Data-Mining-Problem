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
    finalResult.append(`<b>Reminder = ${reminder}</b>`);
    $('#ig-result').append(`<b>Information Gain = (${entropy} - (${reminder.toFixed(4)})) <br> => ${ig} </b>`);

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
    $('.fade-img').fadeIn();


});
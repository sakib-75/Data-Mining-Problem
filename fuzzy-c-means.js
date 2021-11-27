$('#addDataClusterInp').click(function () {
    let clusterAmount = $("#cluster-amount").val();
    let dataPointAmount = $("#dataPoint-amount").val();
    let valueOfm = $("#value-of-m").val();
    let parent = $('#createFuzzyCInput');
    parent.empty();

    if (clusterAmount != '' && dataPointAmount != '' && valueOfm != '') {
        if (dataPointAmount == clusterAmount) {

            for (i = 0; i < dataPointAmount; i++) {
                $('<textarea />').attr({
                    class: 'input level-inp text-area',
                    id: `datapoint-${i}`,
                    placeholder: `Data point ${i+1}`
                }).appendTo(parent);
            }

            for (i = 0; i < clusterAmount; i++) {
                $('<textarea />').attr({
                    class: 'input level-inp text-area',
                    id: `cluster-${i}`,
                    placeholder: `Cluster ${i+1}`
                }).appendTo(parent);
            }

            $(".calculateBtn").show();

        } else {
            alert('Data pint and cluster amount should be same');
        }
    } else {
        alert('Please enter all field');
    }

});





$('#fuzzycCal').click(function () {
    let clusterAmount = $("#cluster-amount").val();
    let valueOfm = $("#value-of-m").val();
    let clusterData = [],
        dataPointValue = [];

    for (i = 0; i < clusterAmount; i++) {
        let cluster = $(`#cluster-${i}`).val(); // Each cluster data
        clusterData[i] = cluster.split(",").map((num) => {
            return +num;
        });

        let datapoint = $(`#datapoint-${i}`).val(); // Each data point value
        dataPointValue[i] = datapoint.split(",").map((num) => {
            return +num;
        });

    }

    //Step 1 : Find centroid
    let centroidPart = [],
        centroidPart1 = 0,
        centroidPart2 = 0;

    $('#centroid-result').addClass('result');
    let centroidresultpart1 = $('#centroid-result-part1');
    centroidresultpart1.empty();

    for (i = 0; i < clusterAmount; i++) { // Cluster loop [0,1,2...]
        centroidresultpart1.append(`<b class='centroid-title'>Centroid ${i+1}: </b><br><br>`)

        for (d = 0; d < clusterAmount; d++) { // Claster inside part

            for (j = 0; j < clusterData[d].length; j++) { // Data loop [0,1,2...]
                let x = dataPointValue[d][j] * Math.pow(clusterData[i][j], valueOfm);
                centroidPart1 += x;

                let y = Math.pow(clusterData[i][j], valueOfm);
                centroidPart2 += y;

            }

            let centroidPoartCal = (centroidPart1 / centroidPart2);
            centroidresultpart1.append(`${centroidPart1.toFixed(4)} &div; ${centroidPart2.toFixed(4)} = ${centroidPoartCal} <br><br>`);
            $('.fade-img').fadeIn();

            centroidPart.push(centroidPoartCal);
            centroidPart1 = centroidPart2 = 0;

        }
    }

});




//................................................................

$('#addClusterInp').click(function () {
    let clusterAmount = $("#cluster-amount2").val();
    let valueOfm = $("#value-of-m").val();
    let parent = $('#cluster-input');
    parent.empty();

    if (clusterAmount != '' && valueOfm != '') {

        for (i = 0; i < clusterAmount; i++) {
            $('<input>').attr({
                type : 'number',
                class: 'input level-inp',
                id: `cluster-date-${i}`,
                placeholder: `Cluster ${i+1} value`
            }).appendTo(parent);
        }
        $(".calculateBtn").show();

    } else {
        alert('Please enter all field');
    }

});


$('#updateMemberValue').click(function () {
    let clusterAmount = $("#cluster-amount2").val();
    let valueOfm = $("#value-of-m2").val();
    let upper, bottom, bottomSum, updatedData, first_value, other_value, power;
    power = (1 / (valueOfm - 1));

    first_value = $(`#cluster-date-0`).val();
    upper = Math.pow((1 / first_value), power);
    bottomSum = upper;

    // Result
    $('#upd-result').addClass('result');
    let updatedresult1 = $('#updated-result1');
    let updatedresult2 = $('#updated-result2');
    let finalupdatedvalue = $('#final-updated-value');
    updatedresult1.empty();
    updatedresult2.empty();
    finalupdatedvalue.empty();

    $('#title').append('Updated membership value');
    let sup = `<sup>(1/(${valueOfm}-1))</sup>`;
    let sup2 = `<sup>${power.toFixed(2)}</sup>`
    updatedresult1.append(`=> ((1/${first_value})${sup}  &div; ((1/${first_value})${sup} + `);
    updatedresult2.append(`=> ((1/${first_value})${sup2}  &div; ((1/${first_value})${sup2} + `);

    for (i = 1; i < clusterAmount; i++) {
        other_value = $(`#cluster-date-${i}`).val();
        bottom = Math.pow((1 / other_value), power);
        bottomSum += bottom;

        //Result
        if (i == (clusterAmount - 1)) {
            updatedresult1.append(`(1/${other_value})${sup}))`);
            updatedresult2.append(`(1/${other_value})${sup2}))`);
        } else {
            updatedresult1.append(`(1/${other_value})${sup} + `);
            updatedresult2.append(`(1/${other_value})${sup2} + `);
        }

    }

    updatedData = (upper / bottomSum);
    finalupdatedvalue.append(`<b>Updated Value: ${updatedData}</b>`);
    $('.fade-img').fadeIn();


});
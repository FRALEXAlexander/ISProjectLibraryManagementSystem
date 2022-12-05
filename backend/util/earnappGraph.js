function createGraphLast24Hours(earnings) {
    let indexStart =
        earnings.timestamp.length - 25 >= 0
            ? earnings.timestamp.length - 25
            : 0;
    let earnedTMP = earnings.earned.slice(
        indexStart,
        earnings.timestamp.length
    );
    let earned = [];
    for (let index = 0; index < earnedTMP.length - 1; index++) {
        earned.push(
            Number(Math.abs(earnedTMP[index + 1] - earnedTMP[index]).toFixed(4))
        );
    }
    let timestamp = earnings.timestamp
        .slice(indexStart, earnings.timestamp.length)
    timestamp.forEach((element, index) => {
        timestamp[index] = new Date(element)
    });
    return {
        type: "bar",
        data: {
            labels: timestamp,
            datasets: [
                {
                    label: "earned",
                    data: earned,
                    backgroundColor: "#3553e9",
                },
            ],
        }
    }
}

function createGraphLast7Days(earnings) {
    //console.log(earnings);

    let indexStart =
        earnings.timestamp.length - 24 * 7 >= 0
            ? earnings.timestamp.length - 24 * 7
            : 0;

    let timestamp = earnings.timestamp
        .slice(indexStart, earnings.timestamp.length)
        .filter((element) => {

            return element.getHours() == 0;
        });
  //  console.log(timestamp);
    timestamp.forEach((element, index) => {
        timestamp[index] = new Date(element).toDateString();
    });

    let earnedTMP = earnings.earned.slice(
        indexStart,
        earnings.timestamp.length
    );

   // console.log(timestamp);

    let earned = [];

    for (let index = 0; index < earnedTMP.length; index = index + 24) {
        earned.push(
            Math.abs(earnedTMP[index + 23] - earnedTMP[index]) > 0.001
                ? Math.abs(earnedTMP[index + 23] - earnedTMP[index])
                : 0
        );
    }
   // console.log(earned)

    return {
        type: "bar",
        data: {
            labels: timestamp,
            datasets: [
                {
                    label: "earned",
                    data: earned,
                    backgroundColor: "#3553e9",
                },
            ],
        }
    }


}


function getTotals(earnings) {
    let earnedTotal =
        earnings.earned_total[earnings.earned_total.length - 1];

    let indexStart =
        earnings.timestamp.length - 25 >= 0
            ? earnings.timestamp.length - 25
            : 0;

    let earned24h = (
        earnings.earned_total[earnings.earned_total.length - 1] -
        earnings.earned_total[indexStart]
    ).toFixed(2);

    let indexStart7d =
        earnings.timestamp.length - 24 * 7 >= 0
            ? earnings.timestamp.length - 24 * 7
            : 0;

    let earned7d = (
        earnings.earned_total[earnings.earned_total.length - 1] -
        earnings.earned_total[indexStart7d]
    ).toFixed(2);

    return { earnedTotal: earnedTotal, earned24h: earned24h, earned7d: earned7d }
}

module.exports = { createGraphLast24Hours, createGraphLast7Days, getTotals }
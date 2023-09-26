function changeFuelType()
{
    let fuelCost = localStorage.getItem(fuelSelect.value);

    if(!fuelCost)
    {
        if(fuelSelect.value === 'unleaded')
        {
            fuelCost = '140';
        }
        else if (fuelSelect.value === 'superUnleaded')
        {
            fuelCost = '160';
        }
        else if (fuelSelect.value === 'diesel')
        {
            fuelCost = '145';
        }
        else if (fuelSelect.value === 'premiumDiesel')
        {
            fuelCost = '165';
        }

        localStorage.setItem(fuelSelect.value,fuelCost);
    }

    let responseText = document.getElementById("fuelPrice")
    responseText.textContent = fuelCost;

    let errorMessage = document.getElementById("fuelErrorMessage");
    errorMessage.textContent = "";

}

function showUpdateFuel()
{
    if(fuelSelect.value === "default")
    {
        let errorMessage = document.getElementById("fuelErrorMessage");
        errorMessage.textContent = "Please Select Fuel";
    }
    else
    {
        document.getElementById('fuelPriceDisplay').style.display = 'none';
        document.getElementById('updateFuelDisplay').style.display = 'inline';
    }
}

function updateFuel()
{
    let newFuleValueInput = document.getElementById("newPrice");
    let newFuelValue = parseInt(newFuleValueInput.value);
    if(!isNaN(newFuelValue))
    {
        localStorage.setItem(fuelSelect.value,newFuelValue)
        
        newFuleValueInput.value = "";
        hideUpdateFuel();
        changeFuelType();
        calculateCosts();
    }
    else
    {
        let errorMessage = document.getElementById("fuelErrorMessage");
        errorMessage.textContent = "Invalid Number";
    }
}

function hideUpdateFuel()
{
    let errorMessage = document.getElementById("fuelErrorMessage");
    errorMessage.textContent = "";

    document.getElementById("newPrice").value = "";

    document.getElementById('fuelPriceDisplay').style.display = 'inline';
    document.getElementById('updateFuelDisplay').style.display = 'none';
}

function showCalculateMpgPopup()
{
    popupContainer.classList.remove('overlayHidden');
    popupContainer.classList.add('overlay');
}

function hideCalculateMpgPopup()
{
    popupContainer.classList.add('overlayHidden');
    popupContainer.classList.remove('overlay');

    document.getElementById("distanceDriven").value = '';
    document.getElementById("fuelConsumed").value = '';
    document.getElementById("calculatedMpg").textContent = '';
}

function calculateMpg()
{
    let distanceInput = document.getElementById("distanceDriven");
    let distance = parseInt(distanceInput.value);

    let fuelConsumedInput = document.getElementById("fuelConsumed");
    let fuelConsumed = parseInt(fuelConsumedInput.value);

    if(mpgDistanceUnitSelector.value === 'kilometers')
    {
        distance = distance/1.603;
    }
    
    if(!isNaN(distance) && !isNaN(fuelConsumed))
    {
        let mpg = (distance/fuelConsumed)*4.544;
        
        let visibleMpg = document.getElementById('calculatedMpg');
        visibleMpg.textContent = round2dp(mpg);
        // console.log(fuelConsumed + ': ' + mpg);
    }
}

function inputCalculatedMpg()
{
    let mpg = document.getElementById("calculatedMpg").textContent;
    document.getElementById('mpg').value = mpg;
    hideCalculateMpgPopup();
    calculateCosts();
}

function calculateCosts()
{
    let pricePerLiter = parseFloat(document.getElementById("fuelPrice").textContent);
    let mpg = parseFloat(document.getElementById('mpg').value);
    let distance = parseFloat(document.getElementById("distance").value);
    
    // console.log(pricePerLiter + " - " + mpg  + " - " + distance);

    if(!isNaN(pricePerLiter) && !isNaN(mpg) && !isNaN(distance))
    {

        let fuelUsed = (distance/mpg)*4.546; //number converts gallons to liters
    
        let costPerTrip = (fuelUsed * pricePerLiter)/100;
        let costPerMile = costPerTrip/distance;

        if(distanceUnitSelector.value==="kilometers")
        {
            document.getElementById("costPerMile").textContent = round2dp(costPerMile*1.609).toFixed(2);
            document.getElementById("tripCost").textContent = round2dp(costPerTrip*1.609).toFixed(2);
        }
        else
        {
            document.getElementById("costPerMile").textContent = round2dp(costPerMile).toFixed(2);
            document.getElementById("tripCost").textContent = round2dp(costPerTrip).toFixed(2);
        }
        document.getElementById("totalFuelConsumed").textContent = round2dp(fuelUsed).toFixed(2);
    }
}

function round2dp(num)
{
    return Math.round(num * 100) / 100;
}

//fuel type dropdown
let fuelSelect = document.getElementById("fuelType");
fuelSelect.addEventListener('change', changeFuelType, false);

//update fuel buttons
let updateFuelButton = document.getElementById("updateFuelPrice");
updateFuelButton.addEventListener('click',showUpdateFuel);
let cancelFuelButton = document.getElementById("cancelNewFuelPrice");
cancelFuelButton.addEventListener('click', hideUpdateFuel);
let confirmFuelButton = document.getElementById("confirmNewFuelPrice")
confirmFuelButton.addEventListener('click',updateFuel);

//show/close mpg calculator menu
let calculateMpgPopupButton = document.getElementById("calculateMpg");
calculateMpgPopupButton.addEventListener('click', showCalculateMpgPopup);
let closecalculateMpgPopupButton = document.getElementById("closeMpgCalculatorMenu");
closecalculateMpgPopupButton.addEventListener('click', hideCalculateMpgPopup);

//units used in mpg calculator
var mpgDistanceUnitSelector = document.getElementById("mpgDistanceUnits");
mpgDistanceUnitSelector.addEventListener('change',calculateMpg, false);

//calculate mpg if input changes
let distanceDrivenPopupInput = document.getElementById("distanceDriven");
distanceDrivenPopupInput.addEventListener('input', calculateMpg);
let fuleConsumedPopupInput = document.getElementById("fuelConsumed");
fuleConsumedPopupInput.addEventListener('input', calculateMpg);

//Send calculated mpg to main calculator
let inputMpgButton = document.getElementById("inputCalculatedMpg");
inputMpgButton.addEventListener('click', inputCalculatedMpg)

//distance selector
var distanceUnitSelector = document.getElementById("distanceUnits");
distanceUnitSelector.addEventListener('change',calculateCosts, false);

//calculate if changed
fuelSelect.addEventListener('change', calculateCosts, false);
document.getElementById("mpg").addEventListener('input', calculateCosts);
document.getElementById("distance").addEventListener('input', calculateCosts);

const popupContainer = document.querySelector('.overlayHidden');

// Controller for 'about' page
export const renderAboutPage = (req, res) => {
    res.render('about.ejs');
};

// Controller for 'methods' page
export const renderMethodsPage = (req, res) => {
    res.render('methods.ejs');
};

// Controller for 'manual' page
export const renderManualPage = (req, res) => {
    res.render('manual.ejs');
};
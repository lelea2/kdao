var Demo = React.createClass({
    render: function() {
        return (
            <div className="container">
                <h1>React.js Radio Group Demo</h1>
                <form>
                    <RadioOption value="tv">
                    Television
                    </RadioOption>
                    <RadioOtherOption/>
                    <p><input type="submit"/></p>
                </form>
            </div>
        );
    }
});

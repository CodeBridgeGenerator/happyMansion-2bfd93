import React from "react";
import { render, screen } from "@testing-library/react";

import WeightPage from "../WeightPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders weight page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <WeightPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("weight-datatable")).toBeInTheDocument();
    expect(screen.getByRole("weight-add-button")).toBeInTheDocument();
});

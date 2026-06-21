import React from "react";
import { render, screen } from "@testing-library/react";

import BrandPage from "../BrandPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders brand page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <BrandPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("brand-datatable")).toBeInTheDocument();
    expect(screen.getByRole("brand-add-button")).toBeInTheDocument();
});

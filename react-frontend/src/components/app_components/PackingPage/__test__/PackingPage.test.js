import React from "react";
import { render, screen } from "@testing-library/react";

import PackingPage from "../PackingPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders packing page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <PackingPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("packing-datatable")).toBeInTheDocument();
    expect(screen.getByRole("packing-add-button")).toBeInTheDocument();
});

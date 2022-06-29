export const reactRouterDomMock = () => ({
    // this mock makes sure any components using the navigate hook can use it without a warning being shown
    useNavigate: (str) => {
        // Don't do anything
    },
    NavLink: jest.fn().mockImplementation(({children}) => {
        return <div>{children}</div>;
    }),
});
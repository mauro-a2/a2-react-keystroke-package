describe('Testing with environment variables using rollup-plugin-dotenv', () => {
    it('Must read an environment variable defined in the .env file.', () => {
        process.env.TEST_VAR = 'test-value'; // Simulation or directly in .env
        expect(process.env.TEST_VAR).toBe('test-value');
    });

    it('Must throw an error if a mandatory environment variable is not defined.', () => {
        const getEnvVariable = (key: string): string => {
            const value = process.env[key];
            if (!value) {
                throw new Error(`Environment variable ${key} not defined`);
            }
            return value;
        };

        expect(() => getEnvVariable('UNDEFINED_VAR')).toThrow(
            'Environment variable UNDEFINED_VAR not defined'
        );
    });
});

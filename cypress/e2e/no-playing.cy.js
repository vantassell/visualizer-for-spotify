describe("playback tests", () => {
  it("logs in", () => {
    cy.visit("localhost:3000");
    cy.get(".new-sign-in").click();
    cy.origin("https://accounts.spotify.com/en/login", () => {
      cy.get("#login-username").type("off.fairfax.test@gmail.com");
      cy.get("#login-password").type("asdfasdf1");
      cy.get("#login-button").click();
    });

    cy.origin("https://accounts.spotify.com/en/authorize", () => {
      cy.get("#privacy-policy").should("be.visible");
      cy.get('[data-testid="auth-accept"]').click();
    });
    cy.origin(
      "https://vantassell.github.io/visualizer-for-spotify-webapp",
      () => {
        cy.get(".new-sign-in").should("not.be.visible");
        cy.get(".sign-out-user").should("be.visible");
        cy.get(".go-to-visualizer").should("be.visible");
        cy.get(".go-to-visualizer").click();
      },
    );

    cy.origin(
      "https://vantassell.github.io/visualizer-for-spotify-webapp/visualizers",
      () => {
        cy.get(".trackInfo").contains(
          "It looks like you aren't currently listening",
        );
      },
    );
  });
  /*
   * Go to Spotify and start playing something
   */
  // cy.visit("https://open.spotify.com/playlist/6hUrtuxWmdur8A7DFkZAYY");
  // cy.wait(2000);
  // cy.origin("https://open.spotify.com/", () => {
  // cy.get('[data-testid="play-button"]').last().click();
  // cy.get(".Button-sc-qlcn5g-0").click();
  // cy.get('[data-encore-id="buttonPrimary]').click();
  // });
});

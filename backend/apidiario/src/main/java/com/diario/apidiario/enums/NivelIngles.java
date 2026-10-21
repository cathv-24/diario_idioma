package com.diario.apidiario.enums;

public enum NivelIngles {
    A1, A2, B1, B2, C1, C2;

    public boolean explicarEnEspanol() {
        return this == A1 || this == A2;
    }
}

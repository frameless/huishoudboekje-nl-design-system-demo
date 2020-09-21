

## The environment
```shell script
    conda env create -f /path/to/environment.yml

    conda env update -f /path/to/environment.yml
```
    
### Adding packages

Packages are prefered from the conda channels but pip is also supported. 
Make sure when adding packages with `pip` that the executable from the conda environment is used.